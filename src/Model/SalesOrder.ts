import type { BaseResource, SelectItem } from "./BaseResource";
import type { CustomerResource } from "./Customer";
import type { PaymentTermListResource } from "./PaymentTerm";
import type { StatusResource } from "./Status";

export interface SalesOrderResource {
  salesOrderId: number;
  salesOrderNumber: string;
  salesOrderDate: Date;
  dueDate: Date;
  associatedSalesOrderNumber: string;
  warehouseName: string;
  skipPicking: boolean;
  customer: CustomerResource;
  warehouse: number;
  priceTier: number;
  referenceNo: string;
  refQuotationNo: string;
  paymentTerm: string;
  paymentTermDescription: string;
  subject: string;
  deliveryDate: Date;
  personInCharge: string;
  currency: string;
  exchangeRate: number;
  subTotal: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  otherCharges: number;
  totalAmount: number;
  baseTotalAmount: number;
  baseVatAmount: number;
  nonVatAmount: number;
  otherChargesLabel: string;
  totalPaidAmount: number;
  baseTotalPaidAmount: number;
  totalCNAmount: number;
  baseTotalCNAmount: number;
  status: StatusResource;
  pickStatus: number;
  packStatus: number;
  shipStatus: number;
  isBackOrder: boolean;
  isSplitOrder: boolean;
  notes: string;
  internalMemo: string;
  salesOrderItems: SalesOrderItemResource[];
}

export interface SalesOrderItemResource {
  salesOrderItemId: number;
  salesOrderNumber: string;
  companyId: number;
  lineNumber: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  deliveryDate: Date;
  unitCost: number;
  baseUnitPrice: number;
  unitPrice: number;
  availableQty: number;
  orderQty: number;
  unit: string;
  unitId: number;
  baseUnit: string;
  baseUnitId: number;
  conversionQty: number;
  baseUnitQty: number;
  discountRate: string;
  discountAmount: number;
  taxId: number;
  taxCode: string;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  description: string;
  image: string;
  shippedQty: number;
  shippedAmount: number;
  balanceQty: number;
  balanceAmount: number;
  parentLineId: number;
  freeItemFlag: boolean;
  trackStock: boolean;

  SelectTax: any;
  SelectItem: any;
  SelectUOM: any;
  DDLItem: any[];
  DDLUOM: any[];
  DDLTAX: any[];
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
    Remark?: string;
    IsPriceExcludeVat: boolean;
    SalesOrderItemResource: SalesOrderItemResource[]; // Array of SalesOrderItemResource
}
