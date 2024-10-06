import authService from '@/Service/AuthService';
import type { AxiosInstance } from 'axios';
import type { PikcingSearch } from '@/Model/Picking';
import type { Result } from '@/Model/Result';
import { Observable, of } from 'rxjs';

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/salesorder`;
const config = {
  headers: { "Content-Type": "application/json" },
};

class SalesOrderService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = {} as AxiosInstance;
    this.initializeAxiosInstance();
  }

  private async initializeAxiosInstance() {
    this.axiosInstance = await authService.getAuthenticatedAxiosInstance();
  }

  private async request(method: string, endpoint: string, data?: any): Promise<Result> {
    debugger
    try {
      const url = `${baseURL}/${endpoint}`;
      let response;

      if (method === "get") {
        response = await this.axiosInstance.get(url, config);
      } else if (method === "put") {
        response = await this.axiosInstance.put(url, data, config);
      } else {
        throw new Error("Unsupported HTTP method");
      }

      if (!response.data) {
        throw new Error("Network response was not ok");
      }

      // Successful result
      return this.createResult(true, "Request succeeded", response.data);
    } catch (error: any) {
      // Handle error using handleError
      return this.handleError(error);
    }
  }

  async search(endpoint: string): Promise<Result> {
    return this.request("get", endpoint);
  }

  async get(id: string): Promise<Result> {
    return this.request("get", `${id}`);
  }

  async getPikcing(search: PikcingSearch): Promise<Result> {
    const url = `${baseURL}/picking/list`;
  
    try {
      const response = await this.axiosInstance.post(url, search, config);
      return this.createResult(true, 'Picking data retrieved', response.data);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  

  private async updateStatus(
    action: string,
    endpoint: string,
    docIds: number[]
  ): Promise<Result> {
    const data = { DocId: docIds };
    return this.request("put", `${action}${endpoint}`, data);
  }

  async approve(endpoint: string, docId: number[]): Promise<Result> {
    return this.updateStatus("approve", endpoint, docId);
  }

  async approves(docId: number[]): Promise<Result> {
    return this.updateStatus("approves", "", docId);
  }

  async cancelApprove(endpoint: string, docId: number[]): Promise<Result> {
    return this.updateStatus("cancelApprove", endpoint, docId);
  }

  async cancel(endpoint: string, docId: number[]): Promise<Result> {
    return this.updateStatus("cancel", endpoint, docId);
  }

  private createResult(success: boolean, message: string, data: any): Result {
    return {
      Code: success,
      Message: message,
      Data: data
    };
  }

  private handleError(error: any): Result {
    console.error(error); // Log error to the console

    const errorMessage = error?.response?.data?.message || error.message || 'An error occurred';
    return this.createResult(false, errorMessage, null);
  }

  private log(message: string) {
    // console.log(message);
    // this.messageService.add('VendorUserService: ' + message);
  }
}
export default new SalesOrderService();