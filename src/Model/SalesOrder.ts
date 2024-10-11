import type { BaseResource, SelectItem } from "./BaseResource";
import type { CustomerResource } from "./Customer";
import type { PaymentTermListResource } from "./PaymentTerm";
import type { StatusResource } from "./Status";

export interface SalesOrderResource {
    SalesOrderId: number;
    SalesOrderNumber: string;
    SalesOrderDate: Date;
    DueDate: Date;
    AssociatedSalesOrderNumber: string;
    WarehouseName: string;
    SkipPicking: boolean;
    Customer: CustomerResource;
    Warehouse: number;
    PriceTier: number;
    ReferenceNo: string;
    RefQuotationNo: string;
    PaymentTerm: string;
    PaymentTermDescription: string;
    Subject: string;
    DeliveryDate: Date;
    PersonInCharge: string;
    Currency: string;
    ExchangeRate: number;
    SubTotal: number;
    TaxAmount: number;
    DiscountRate: number;
    DiscountAmount: number;
    OtherCharges: number;
    TotalAmount: number;
    BaseTotalAmount: number;
    BaseVatAmount: number;
    NonVatAmount: number;
    OtherChargesLabel: string;
    TotalPaidAmount: number;
    BaseTotalPaidAmount: number;
    TotalCNAmount: number;
    BaseTotalCNAmount: number;
    Status: StatusResource;
    PickStatus: number;
    PackStatus: number;
    ShipStatus: number;
    IsBackOrder: boolean;
    IsSplitOrder: boolean;
    Notes: string;
    InternalMemo: string;
    SalesOrderItems: SalesOrderItemResource[];
}

export interface SalesOrderItemResource {
  SalesOrderItemID: number;
  SalesOrderNumber: string;
  CompanyID: number;
  LineNumber: number;
  ItemId: number; // Kept the original casing for 'Id'
  ItemCode: string;
  ItemName: string; // 'name' stays as originally written
  DeliveryDate: Date;
  UnitCost: number;
  BaseUnitPrice: number;
  UnitPrice: number;
  AvaliableQty: number; // Preserved the original spelling
  OrderQty: number;
  Unit: string;
  UnitID: number;
  BaseUnit: string;
  BaseUnitID: number;
  ConversionQty: number;
  BaseUnitQty: number;
  DiscountRate: number;
  DiscountAmount: number;
  TaxID: number;
  TaxCode: string;
  TaxRate: number;
  TaxAmount: number;
  LineTotal: number;
  Description: string;
  Image: string;
  ShippedQty: number;
  ShippedAmount: number;
  BalanceQty: number;
  BalanceAmount: number;
  ParentLineId: number; // Kept 'Id' in lowercase
  FreeItemFlag: boolean;
  TrackStock: boolean;
  SelectItem: SelectItem;
  DDLItem: any[];
}
    

export interface SalesOrderSearch {
    salesOrderNo: string
    customer: string
    status: number
    warehouse: number
    pickingNo: string
    personInCharge: string
    itemCode: string
    itemName: string
    purchaseOrderDate: Date | null
    dateRange: [Date, Date] | null
    remark: string
  }


  export interface SalesOrderSaveResource extends BaseResource {
    SalesOrderID: number;
    SalesOrderNumber: string;
    SalesOrderDate: Date ; // Use Date for DateTime in TypeScript
    DeliveryDate: Date;
    DueDate: Date;
    AssociatedSONo: string;
    Customer: CustomerResource | null;
    PriceTier: number;
    WarehouseID: number;    
    ReferenceNo: string;
    RefQuotationNo: string;
    PaymentTerm: PaymentTermListResource | null;
    PersonInCharge: string; // Corrected 'PersonInChrage' typo
    Currency: string;
    DiscountRate: number;
    DiscountAmount: number;
    OtherCharges: number;
    SkipPicking: boolean;
    Status: StatusResource | null;
    PickStatus: number;
    PackStatus: number;
    ShipStatus: number;
    IsBackOrder: boolean;
    IsSplitOrder: boolean;
    Notes: string;
    InternalMemo: string;
    MemoDate: Date;
    MemoBy: string;
    IsPriceExcludeVat: boolean;
    SalesOrderItemResource: SalesOrderItemResource[]; // Array of SalesOrderItemResource
}
