import authService from "@/service/authService";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import ErrorService from "./errorService";
import type { ItemSearch } from "@/Model/Item";
import type { SelectItem } from "@/Model/BaseResource";

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
        tap(() => this.errorService.log("Fetched item list")),
        catchError(this.errorService.handleError<any[]>("item list"))
      );
  }

  getitemByItemID(endpoint: number): Observable<Result<any[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched item detail")),
        catchError(this.errorService.handleError<any[]>("item detail"))
      );
  }

  getitemFilter(endpoint: ItemSearch): Observable<Result<any[]>> {
    const url = `${baseURL}/search`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.post<Result<any[]>>(url,endpoint))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched item dropdown")),
        catchError(this.errorService.handleError<any[]>("item dropdown"))
      );
  }

  getUOMByItemId(itemId: number): Observable<Result<any[]>> {
    const url = `${baseURL}/uom/${itemId}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched UOM dropdown")),
        catchError(this.errorService.handleError<any[]>("UOM dropdown"))
      );
  }

}

export default new ItemService();