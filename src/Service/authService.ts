import { isLoading } from '@/router';
import axios, { AxiosError, type AxiosInstance } from 'axios';
import { useRouter } from 'vue-router';

const AUTH_TOKEN_KEY = 'access_token';
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_URL;

const API_URL = `${apiUrl}/v1/authen`;
const TOKEN_PATH = import.meta.env.VITE_API_AUTH;

interface LoginResult {
  success: boolean;
  message: string;
  token?: string;
}

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

const authService = {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      debugger
      const requestBody = new URLSearchParams();
      requestBody.append('grant_type', 'password');
      requestBody.append('username', username);
      requestBody.append('password', password);
  
      const response = await axios.post(
        TOKEN_PATH,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.data && response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true, message: 'Login successful', token };
      } 
  
      return { success: false, message: 'Login failed: Unexpected response structure' };
  
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (axios.isAxiosError(error) && error.response) {
        switch (error.response.status) {
          case 400:
          case 401:
            errorMessage = 'Invalid username or password';
            break;
          case 403:
            errorMessage = 'Account is not activated';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again later.';
            break;
          default:
            errorMessage = `Server error: ${error.response.status}`;
        }
        
        if (error.response.data && error.response.data.error_description) {
          errorMessage = error.response.data.error_description;
        }
      } else if (axios.isAxiosError(error) && error.request) {
        errorMessage = 'No response from server: Please check your connection';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  },

  async getAuthenticatedAxiosInstance() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  },

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return false;
    }

    try {
      const response = await axios.get<boolean>(`${API_URL}/Verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Token verification failed:", error);
      await this.logout(); // Clear invalid token
      throw new Error("Invalid token");
    }
  },
};

export default authService;