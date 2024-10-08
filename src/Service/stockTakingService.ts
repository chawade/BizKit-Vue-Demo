import authService from '@/Service/AuthService';
const apiUrl = import.meta.env.VITE_API_URL;

const baseURL = `${apiUrl}/v1/stocktaking`;

class StockTakingService {
  private axiosInstance : any | undefined ;

  constructor() {
    this.initializeAxiosInstance();
  }

  private async initializeAxiosInstance() {
    this.axiosInstance = await authService.getAuthenticatedAxiosInstance();
  }

  private async request(method: string, endpoint: string, data?: any) {
    debugger;
    try {
      const url = `${baseURL}/${endpoint}`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      let response;
      if (method === 'get') {
        response = await this.axiosInstance.get(url, config);
      } else if (method === 'put') {
        response = await this.axiosInstance.put(url, data, config);
      } else {
        throw new Error('Unsupported HTTP method');
      }

      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async search(endpoint: string) {
    return this.request('get', endpoint);
  }

  async get(id: number) {
    return this.request('get', `${id}`);
  }

  private async put(action: string, endpoint?: string, docIds?: number[], status?: number) {
    const data = { DocId: docIds, Status: status };
    return this.request('put', `${action}${endpoint}`, data);
  }

  async updateStatus(docId: number[], status?: number ) {
    return this.put('status', '', docId, status);
  }

  async approve(endpoint: string, docId: number[]) {
    return this.put('approve', endpoint, docId, undefined);
  }
  
  async approves(docId: number[]) {
    return this.put('approves', '', docId, undefined);
  }

  async cancelApprove(endpoint: string, docId: number[]) {
    return this.put('cancelApprove', endpoint, docId, undefined);
  }

  async cancel(endpoint: string, docId: number[]) {
    return this.put('cancel', endpoint, docId, undefined);
  }
}

export default new StockTakingService();
