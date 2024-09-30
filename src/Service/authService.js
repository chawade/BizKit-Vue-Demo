import axios from 'axios';

const AUTH_TOKEN_KEY = 'access_token';

const authService = {
  async login(username, password) {
    try {
      const response = await axios.post('http://localhost:3692/oauth/token', new URLSearchParams({
        grant_type: 'password',
        UserName: username,
        Password: password
      }));
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

  isAuthenticated() {
    return !!this.getToken();
  },

  async getAuthenticatedAxiosInstance() {
    let token = this.getToken();
    if (!token) {
      token = await this.login('suchawadee.y@ku.th', 'Abc12345');
    }
    // console.log('Token:', token);
    return axios.create({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

export default authService;
