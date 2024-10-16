import authService from "@/Service/authService";
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from "axios";
import type { Error, Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import type { PickingSearch } from "@/Model/Picking";
import ErrorService from "./errorService";
import type { VendorResource } from "@/Model/vendor";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/vendor`;

class VendorService {
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

  get(id: number): Observable<Result<VendorResource>> {
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<VendorResource>>(`${baseURL}/${id}`, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<VendorResource>>) => response.data),
      tap(() => this.errorService.log(`Fetched sales order with id ${id}`)),
      catchError(this.errorService.handleError<VendorResource>(`get id=${id}`))
    );
  }
}

export default new VendorService();