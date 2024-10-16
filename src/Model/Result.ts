import type { HttpStatusCode } from "axios";

// Base interfaces
export interface Error {
  code?: string | number;
  message?: string;
}

export interface Result<T> {
  error?: Error;
  isSuccess: boolean;
  pagination?: Pagination;
  sorting?: SortingInfo;
  statusCode: HttpStatusCode;
  data?: any;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface SortingInfo {
  sortBy: string;
  sortDirection: string;
}
