import authService from '@/service/AuthService';
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from 'axios';
import { Observable, from } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import ErrorService from './errorService';
import type { Result } from '@/Model/Result';
import type { StockTakingResource } from '@/Model/StockTaking';

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = `${apiUrl}/v1/stocktaking`;

class StockTakingService {
  private axiosInstance$: Observable<AxiosInstance>;
  private errorService: ErrorService;

  constructor() {
    this.axiosInstance$ = from(authService.getAuthenticatedAxiosInstance());
    this.errorService = new ErrorService();
  }

  private getHttpOptions() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    };
  }

  search(endpoint: string): Observable<Result<StockTakingResource[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<StockTakingResource[]>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<StockTakingResource[]>>) => response.data),
      tap(() => this.errorService.log('Fetched stocktaking list')),
      catchError(this.errorService.handleError<StockTakingResource[]>('search'))
    );
  }

  get(id: number): Observable<Result<StockTakingResource>> {
    const url = `${baseURL}/${id}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<StockTakingResource>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<StockTakingResource>>) => response.data),
      tap(() => this.errorService.log(`Fetched stocktaking with id ${id}`)),
      catchError(this.errorService.handleError<StockTakingResource>(`get id=${id}`))
    );
  }

  private put(action: string, docIds?: number[], status?: number): Observable<Result<any>> {
    const url = `${baseURL}/${action}`;
    const data = { DocId: docIds, Status: status };
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.put<Result<any>>(url, data, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<any>>) => response.data),
      tap(() => this.errorService.log(`Updated status for action ${action}`)),
      catchError(this.errorService.handleError<any>(`put action=${action}`))
    );
  }

  updateStatus(docIds: number[], status?: number): Observable<Result<any>> {
    return this.put('status', docIds, status);
  }

  approve(docIds: number[]): Observable<Result<any>> {
    return this.put('approve', docIds);
  }

  approves(docId: number[]) {
    return this.put('approves', docId);
  }
  cancelApprove(docIds: number[]): Observable<Result<any>> {
    return this.put(`cancelApprove/${docIds}`, docIds);
  }

  cancel(docIds: number[]): Observable<Result<any>> {
    return this.put('cancel', docIds);
  }
}

export default new StockTakingService();
