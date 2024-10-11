import authService from "@/Service/authService";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import ErrorService from "./errorService";
import type { ItemSearch } from "@/Model/Item";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/item`;

class ItemService {
  private axiosInstance: Observable<AxiosInstance>;;
  private errorService: ErrorService;

  constructor() {
    this.axiosInstance = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }

  getitemList(endpoint: string): Observable<Result<any[]>> {
    const url = `${baseURL}/search/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }

  getitemByItemID(endpoint: number): Observable<Result<any[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }

  getitemFilter(endpoint: ItemSearch): Observable<Result<any[]>> {
    const url = `${baseURL}/search`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.post<Result<any[]>>(url,endpoint))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }

}

export default new ItemService();