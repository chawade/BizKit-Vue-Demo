import authService from '@/Service/authService.js';

const baseURL = 'http://localhost:3692/api/v1/stocktaking';

const StockTakingService = {
  async search(endpoint) {
    try {
      const axiosInstance = await authService.getAuthenticatedAxiosInstance();
      const response = await axiosInstance.get(`${baseURL}/${endpoint}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  },

  async get(id) {
    try {
      const axiosInstance = await authService.getAuthenticatedAxiosInstance();
      const response = await axiosInstance.get(`${baseURL}/${id}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  }
};

export { StockTakingService };