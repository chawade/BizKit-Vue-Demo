import authService from "@/service/authService";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import ErrorService from "./errorService";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/user`;

class UserService {
  private axiosInstance: Observable<AxiosInstance>;;
  private errorService: ErrorService;

  constructor() {
    this.axiosInstance = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }

  getUserList(endpoint: string): Observable<Result<any[]>> {
    debugger
    const url = `${baseURL}/list/${endpoint}`;
    return this.axiosInstance.pipe(
        switchMap((axiosInstance) =>
          from(axiosInstance.get<Result<any[]>>(url))
        ),
        map((response: AxiosResponse<Result<any[]>>) => response.data),
        tap(() => this.errorService.log("Fetched customer dropdown")),
        catchError(this.errorService.handleError<any[]>("customer dropdown"))
      );
  }
}

export default new UserService();