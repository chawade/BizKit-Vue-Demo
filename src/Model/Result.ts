import type { HttpStatusCode } from "axios";

// Base interfaces
export interface Error {
  Code?: string | number;
  Message?: string;
}

export interface Result<T>{
  Error?: Error;
  IsSuccess: boolean;
  Pagination?: Pagination;
  Sorting?: SortingInfo;
  StatusCode: HttpStatusCode;
  Data?: any;
}

export interface Pagination
{
    PageNumber: number
    PageSize: number
    TotalRecords: number
    TotalPages: number
    HasPrevious: Boolean
    HasNext: Boolean
}

export interface SortingInfo
{
    SortBy: string
    SortDirection: string
}