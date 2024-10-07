import authService from '@/Service/authService';
import axios from 'axios';

const baseURL = 'http://localhost:3692/api/v1/purchaserequest';
const axiosInstance = await authService.getAuthenticatedAxiosInstance();

const resource = {
  async updatestatus(docIds:number[]) {
    return {
      DocId: docIds
    };
  }
};

const PurchaseRequestService = {
  async search(endpoint:any) {
    try {
      const response = await axiosInstance.get(`${baseURL}/${endpoint}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error:any) {
      alert(error.message);
    }
  },

  async get(prNo : string,) {
    try {
      const response = await axiosInstance.get(`${baseURL}/${prNo}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error:any) {
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

export { PurchaseRequestService }