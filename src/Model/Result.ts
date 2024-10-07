// Base interfaces
interface IError {
  code: string;
  message: string;
}

export interface Result{
  Code: boolean;
  Message: string;
  Data: any;
  Pagination?: Pagination
  Sorting?: SortingInfo
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