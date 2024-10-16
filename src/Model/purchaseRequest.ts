import type { BaseResource, SelectItem } from "./BaseResource";
import type { PaymentTermListResource } from "./PaymentTerm";
import type { StatusResource } from "./Status";

export interface PurchaseRequest {
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  VendorName: string;
  Vendor: Vendor | null;
  Project: string;
  Department: string;
  Status: StatusResource;
  Amount: number;
  ReferenceNo: string;
  PRNoSearchPlaceholder: string;
  Remark: string;
  ItemCode: string;
  ItemName: string;
  selectedItems: boolean;
  TotalAmount: number;
  IssueDate: string;
  PersonInCharge: string;
  ProjectName: '';
  DepaermentName: '';
  Notes: string;
  Subtotal: number;
  TaxAmount: number;
  OtherCharges: number;
}

export interface Vendor {
  VendorId: number;
  CompanyId: number;
  VendorCode: string | null;
  VendorName: string;
}
export interface Status {
  StatusId: number;
  StatusName: string;
  LocalStatusName: string | null;
  StatusBgColor: string;
  StatusBorderColor: string;
  StatusFontColor: string;
  StatusFontSize: number;
}
export interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  style?: string;
  filterable?: boolean;
  filterField?: string;
}


export interface PurchaseRequestSave extends BaseResource{
  PurchaseRequestNo: string;
  CompanyId: number;
  PurchaseRequestDate: Date;
  TermDescription: string;
  ReferenceNo: string;
  PaymentTerm: PaymentTermListResource | null;
  Vendor: Vendor | null;
  StatusId: number;
  DeliveryDate: Date;
  DueDate: Date;
  DeliveryAddress1: string;
  DeliveryAddress2: string;
  DeliveryCity: string;
  DeliveryState: string;
  DeliveryZipCode: string;
  DeliveryCountry: string;
  PersonInCharge: string;
  Currency: string;
  ExchangeRate: number;
  TaxAmount: number;
  DiscountRate: number;
  DiscountAmount: number;
  OtherCharges: number;
  Subtotal: number;
  Notes: string;
  TermAndConditions: string;
  TemplateId: number;
  TotalAmount: number;
  PurchaseRequestItems: PurchaseRequestItemSave[];
  UserId: string;
  IpAddress: string;
  Url: string;
  Project: string;
  Department: string;
  DDLItem: SelectItem[];
}

export interface VendorSave {
  VendorId: number;
  CompanyId: number;
  VendorCode: string;
  VendorName: string;
  VendorType: string;
  VendorBalance: number;
  BaseVendorBalance: number;
  CreditBalance: number;
  ContactId: number;
  ContactName: string;
  ContactEmail: string;
  ContactTelNo: string;
  CompanyName: string;
  Address1: string;
  Address2: string;
  Address3: string;
  City: string;
  State: string;
  Country: string;
  ZipCode: string;
  Telephone1: string;
  Telephone2: string;
  Email: string;
  Fax: string;
  Website: string;
  PaymentTerm: string;
  CurrencyCode: string;
  BranchFlag: boolean;
  BranchCode: string;
  TaxId: string;
  VendorSince: string;
  LeadTime: number;
  Remark: string;
  APAccountId: number;
  Status: Status;
}

export interface PurchaseRequestItemSave {
  PurchaseRequestNo: string;
  CompanyId: number;
  LineNumber: number;
  ItemId: number;
  ItemCode: string;
  Description: string;
  RequiredDate: string;
  OrderQuantity: number;
  Unit: string;
  UnitCost: number;
  DiscountRate: number;
  DiscountAmount: number;
  VatId: number;
  VatCode: string;
  VatRate: number;
  VatAmount: number;
  LineTotal: number;
  PurchaseOrderNo: string;
  ReferenceNo: string;
  ReferenceLineNumber: number;
  DDLItem: SelectItem[];
}

export interface PRHeaderSearch {
  CompanyID: number;
  PeriodFrom?: Date;
  PeriodTo?: Date;
  DeliveryDateFrom?: Date;
  DeliveryDateTo?: Date;

  stringPeriodFrom?: string;
  stringPeriodTo?: string;
  stringDeliveryDateFrom?: string;
  stringDeliveryDateTo?: string;
  stringTotalFrom?: string;
  stringTotalTo?: string;

  Remark?: string;
  PONo?: string;
  ItemCode?: string;
  ItemName?: string;
  TotalFrom?: number;
  TotalTo?: number;
  DetailSearch: boolean;
  PRNo?: string;
  Status: number;
  VendorID: number;
  ReferenceNo?: string;
  UpdateBy?: string;
  URL?: string;
  IPAddress?: string;
  Vendor: string;
}


