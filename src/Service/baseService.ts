import type { Result } from "@/Model/Result";
import { Observable, catchError, from, map, of, switchMap, tap } from "rxjs";
import type { AxiosInstance, AxiosResponse } from "axios";
import ErrorService from "./errorService";
import authService from "./authService";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}`.replace('/api','');

class BaseService {
  private axiosInstance: Observable<AxiosInstance>;
  private errorService: ErrorService;
  constructor() {
    this.axiosInstance = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }
  getOperationLog(endpoint: string): Observable<Result<any[]>> {
    debugger
    const url = `${baseURL}/activity/${endpoint}`;
    return this.axiosInstance.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<any[]>>(url))
      ),
      map((response: AxiosResponse<Result<any[]>>) => response.data),
      tap(() => this.errorService.log("Fetched customer list")),
      catchError(this.errorService.handleError<any[]>("getCustomerList"))
    );
  }
}

export default new BaseService();