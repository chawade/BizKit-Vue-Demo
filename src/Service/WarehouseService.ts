import authService from "@/Service/authService";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import ErrorService from "./errorService";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/warehouse`;

class WarehouseService {
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

  getWarehouseList(): Observable<Result<any[]>> {
    const url = `${baseURL}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url, this.getHttpOptions()))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }
}

export default new WarehouseService();