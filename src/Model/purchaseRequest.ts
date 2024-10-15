import type { BaseResource, SelectItem } from "./BaseResource";
import type { PaymentTermListResource } from "./PaymentTerm";

export interface PurchaseRequest {
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  VendorName: string;
  Vendor: Vendor | null;
  Project: string;
  Department: string;
  Status: Status;
  Amount: number;
  ReferenceNo: string;
  PRNoSearchPlaceholder: string;
  Remark: string;
  ItemCode: string;
  ItemName: string;
  selectedItems: boolean;
  TotalAmount: number;
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

