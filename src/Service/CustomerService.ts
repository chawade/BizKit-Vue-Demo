import authService from "@/service/authService";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import ErrorService from "./errorService";
import type { CustomerResource } from "@/Model/Customer";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/customer`;

class CustomerService {
  private axiosInstance: Observable<AxiosInstance>;;
  private errorService: ErrorService;

  constructor() {
    this.axiosInstance = from(authService.getAuthenticatedAxiosInstance());
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

  getCustomerList(endpoint: string): Observable<Result<any[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url, this.getHttpOptions()))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }

  getCustomerById(endpoint: number): Observable<Result<CustomerResource>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<CustomerResource[]>>(url, this.getHttpOptions()))
        ),
        map((response: AxiosResponse<Result<CustomerResource[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer details")),
        catchError(this.errorService.handleError<CustomerResource[]>("customer"))
      );
  }
}

export default new CustomerService();