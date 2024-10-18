import ErrorService from "./errorService";
import authService from "@/service/authService";
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from "axios";
import type { Error, Result } from "@/Model/Result";
import { Observable, from, of } from "rxjs";
import { map, catchError, tap, switchMap } from "rxjs/operators";
import type { ProjectListResource } from "@/Model/project";
import type { DepartmentListResource } from "@/Model/department";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/companyprofile`;

class CompanyProfileService {
  private axiosInstance: Observable<AxiosInstance>;
  private errorService: ErrorService;
  constructor() {
    this.axiosInstance = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }


  getList(type: string): Observable<Result<any[]>> {
    debugger
    const url = `${baseURL}/shipaddress/${type}`;
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

export default new CompanyProfileService();