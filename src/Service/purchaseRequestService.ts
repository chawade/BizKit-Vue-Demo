import authService from '@/Service/AuthService';

const apiUrl = import.meta.env.VITE_API_URL;

const baseURL = `${apiUrl}/v1/purchaserequest`;

class PurchaseRequetService {
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

  async get(no: string) {
    console.log(no)
    return this.request('get', no);
  }

  private async put(action: string, endpoint?: string, docNos?: string, status?: number) {
    const data = { DocNo: docNos, Status: status };
    return this.request('put', `${action}${endpoint}`, data);
  }

  async updateStatus(docNo: string, status?: number ) {
    return this.put('status', '', docNo, status);
  }

  async approve(endpoint: string, docNo: string) {
    return this.put('approve', endpoint, docNo, undefined);
  }
  
  async approves(docNo: string) {
    return this.put('approves', '', docNo, undefined);
  }

  async cancelApprove(endpoint: string, docNo: string) {
    return this.put('cancelApprove', endpoint, docNo, undefined);
  }

  async cancel(endpoint: string, docNo: string) {
    return this.put('cancel', endpoint, docNo, undefined);
  }
}

export default new PurchaseRequetService();