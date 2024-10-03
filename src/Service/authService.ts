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
    // let token = this.getToken();
    // if (token == null || this.isTokenExpired(token)) {
    //   console.log('Token is Expired!!');
    //   await this.logout();
    //   token = await this.login('suchawadee.y@ku.th', 'Abc12345');
    // }
    // console.log('Token:', token);

    // axios.interceptors.request.use(
    //   (config) => {
    //     const token = localStorage.getItem("authToken");
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    //   },
    //   (error) => Promise.reject(error)
    // );
    
    return axios.create({
      headers: {
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiIzN2YzZDA1ZS1kM2QyLTQyOTktODRhNi0xYTY0YjgyNjY0NmMiLCJ1bmlxdWVfbmFtZSI6WyJTdWNoYXdhZGVlIiwic3VjaGF3YWRlZS55QGt1LnRoIl0sImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vYWNjZXNzY29udHJvbHNlcnZpY2UvMjAxMC8wNy9jbGFpbXMvaWRlbnRpdHlwcm92aWRlciI6IkFTUC5ORVQgSWRlbnRpdHkiLCJzdWIiOiJzdWNoYXdhZGVlLnlAa3UudGgiLCJiekNvbXBhbnlJRCI6IjEwMzIiLCJielBsYW5JRCI6IjAiLCJielVzZXJJRCI6IjM3ZjNkMDVlLWQzZDItNDI5OS04NGE2LTFhNjRiODI2NjQ2YyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzY5MiIsImF1ZCI6IjQxNGUxOTI3YTM4ODRmNjhhYmM3OWY3MjgzODM3ZmQxIiwiZXhwIjoxNzI4MDMzNTYxLCJuYmYiOjE3Mjc5NDcxNjF9.swuiT_UxFQ_ZnuVZXikyj9Satp5iPKvP7V-AXW_pgws`
      }
    });
  }
};

export default authService;
