import axios from 'axios';

const AUTH_TOKEN_KEY = 'access_token';

const authService = {
  async login(username: string, password: string) {
    try {      
      const response = await axios.post('http://localhost:3692/oauth/token', new URLSearchParams({
        grant_type: 'password',
        UserName: username,
        Password: password
      }));
      console.log('full response: ',response)
      const token = response.data.access_token;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
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
  }
};

export default authService;
