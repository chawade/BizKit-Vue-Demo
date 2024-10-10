export interface BaseResource {
  UserId?: string;
  CompanyId?: number;
  IpAddress?: string;
  Url?: string;
  UpdateDate?: Date;
  UpdateBy?: string;
}


export interface SelectItem {
  name: string;
  code: string;
}