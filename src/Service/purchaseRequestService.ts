import authService from "@/Service/authService";
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from "axios";
import type { Error, Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import type { PickingSearch } from "@/Model/Picking";
import ErrorService from "./errorService";
import type { PRHeaderSearch, PurchaseRequest } from "@/Model/purchaseRequest";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/purchaserequest`;

class PurchaseRequetService {
  private axiosInstance$: Observable<AxiosInstance>;
  private errorService: ErrorService;
  constructor() {
    this.axiosInstance$ = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }

  private getHttpOptions() {
    return {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
    };
  }

  search(endpoint: string): Observable<Result<PurchaseRequest[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<PurchaseRequest[]>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<PurchaseRequest[]>>) => response.data),
      tap(() => this.errorService.log("Fetched customer list")),
      catchError(this.errorService.handleError<PurchaseRequest[]>("getCustomerList"))
    );
  }
  searchDetail(search: PRHeaderSearch): Observable<Result<PurchaseRequest[]>> {
    const url = `${baseURL}/search`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.post<Result<PurchaseRequest[]>>(url, search, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<PurchaseRequest[]>>) => response.data),
      tap(() => this.errorService.log("Fetched sales order details")),
      catchError(this.errorService.handleError<PurchaseRequest[]>("searchDetail"))
    );
  }
  get(no: string): Observable<Result<PurchaseRequest>> {
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<PurchaseRequest>>(`${baseURL}/${no}`, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<PurchaseRequest>>) => response.data),
      tap(() => this.errorService.log(`Fetched sales order with id ${no}`)),
      catchError(this.errorService.handleError<PurchaseRequest>(`get id=${no}`))
    );
  }

  // async getlist(endpoint: string) {
  //   return this.request('get', endpoint);
  // }

  // async get(no: string) {
  //   return this.request('get', no);
  // }

  // private async put(action: string, endpoint?: string, docNos?: string, status?: number) {
  //   const data = { DocNo: docNos, Status: status };
  //   return this.request('put', `${action}${endpoint}`, data);
  // }

  // async updateStatus(docNo: string, status?: number ) {
  //   return this.put('status', '', docNo, status);
  // }

  // async approve(endpoint: string, docNo: string) {
  //   return this.put('approve', endpoint, docNo, undefined);
  // }
  
  // async approves(docNo: string) {
  //   return this.put('approves', '', docNo, undefined);
  // }

  // async cancelApprove(endpoint: string, docNo: string) {
  //   return this.put('cancelApprove', endpoint, docNo, undefined);
  // }

  // async cancel(endpoint: string, docNo: string) {
  //   return this.put('cancel', endpoint, docNo, undefined);
  // }
}

export default new PurchaseRequetService();