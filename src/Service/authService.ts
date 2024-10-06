import axios from 'axios';
import { useRouter } from 'vue-router';

const AUTH_TOKEN_KEY = 'access_token';
const router = useRouter();

const apiUrl = import.meta.env.VITE_API_URL;

const API_URL = apiUrl + "/v1/authen"; 

const authService = {
  async login(username: string, password: string) {
    const response = await axios.post(`${API_URL}/login`, {
      Username: username,
      Password: password,
    });
    if (response.data && response.data.token) {
      // Save token to localStorage or Vuex
      localStorage.setItem("authToken", response.data.token.access_token);
    }
    return response.data;
  },
  logout() {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common['Authorization'];
    router.push({ name: "login" });
  },
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isTokenExpired(token: string) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  },

  async getAuthenticatedAxiosInstance() {
    let token = localStorage.getItem('authToken');
    console.log('Token:', token);
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  async verifyToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push({ name: "login" });
      throw new Error("No token found");
    }

    try {
      const response = await axios.get(`${API_URL}/Verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // This will be the result of ValidateToken(Token) from your backend
    } catch (error) {
      console.error("Token verification failed:", error);
      this.logout(); // Clear invalid token
      throw new Error("Invalid token");
    }
  },
};

export default authService;
