import authService from '@/Service/authService';

const baseURL = 'http://localhost:3692/api/v1/stocktaking';
const axiosInstance = await authService.getAuthenticatedAxiosInstance();

const resource = {
  async updatestatus(docIds) {
    return {
      DocId: docIds
    };
  }
};

const StockTakingService = {
  async search(endpoint) {
    try {
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
      const response = await axiosInstance.get(`${baseURL}/${id}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  },

  async approve(endpoint, docId) {
    try {
      const data = await resource.updatestatus(docId);
      const response = await axiosInstance.put(`${baseURL}/approve/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  },

  async cancelApprove(endpoint, docId) {
    try {

      const data = await resource.updatestatus(docId);
      const response = await axiosInstance.put(`${baseURL}/cancelApprove/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error) {
      alert(error.message);
    }
  },

  async cancel(endpoint, docId) {
    try {

      const data = await resource.updatestatus(docId);
      const response = await axiosInstance.put(`${baseURL}/cancel/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
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