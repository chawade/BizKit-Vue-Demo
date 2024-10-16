import authService from '@/service/authService';
import { HttpStatusCode, type AxiosInstance, type AxiosResponse } from 'axios';
import { Observable, from } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import ErrorService from './errorService';
import type { Result } from '@/Model/Result';
import type { stockTakingHeaderList, stockTakingHeader } from '@/Model/stockTaking';

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

  search(endpoint: string): Observable<Result<stockTakingHeaderList[]>> {
    const url = `${baseURL}/${endpoint}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<stockTakingHeaderList[]>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<stockTakingHeaderList[]>>) => response.data),
      tap(() => this.errorService.log('Fetched stocktaking list')),
      catchError(this.errorService.handleError<stockTakingHeaderList[]>('search'))
    );
  }

  get(id: number): Observable<Result<stockTakingHeader>> {
    const url = `${baseURL}/${id}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<stockTakingHeader>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<stockTakingHeader>>) => response.data),
      tap(() => this.errorService.log(`Fetched stocktaking with id ${id}`)),
      catchError(this.errorService.handleError<stockTakingHeader>(`get id=${id}`))
    );
  }

  getStockItemForTaking(warehouseId?: number, locationId?: number): Observable<Result<any>> {
    const url = `${baseURL}/items/${warehouseId}/${locationId}`;
    return this.axiosInstance$.pipe(
      switchMap((axiosInstance) =>
        from(axiosInstance.get<Result<stockTakingHeader>>(url, this.getHttpOptions()))
      ),
      map((response: AxiosResponse<Result<stockTakingHeader>>) => response.data),
      tap(() => this.errorService.log(`Fetched stock items with warehouse id ${warehouseId} and location id ${locationId}`)),
      catchError(this.errorService.handleError<stockTakingHeader>('get stockI  items for taking'))
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
