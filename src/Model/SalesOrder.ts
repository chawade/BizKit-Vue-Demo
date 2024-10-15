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
    salesOrderID: number;
    salesOrderNumber: string;
    salesOrderDate: Date ; // Use Date for DateTime in TypeScript
    deliveryDate: Date;
    dueDate: Date;
    associatedSONo: string;
    customer: CustomerResource | null;
    priceTier: number;
    warehouseID: number;    
    referenceNo: string;
    refQuotationNo: string;
    paymentTerm: PaymentTermListResource | null;
    personInCharge: string; // Corrected 'PersonInChrage' typo
    currency: string;
    discountRate: number;
    discountAmount: number;
    otherCharges: number;
    skipPicking: boolean;
    status: StatusResource | null;
    pickStatus: number;
    packStatus: number;
    shipStatus: number;
    isBackOrder: boolean;
    isSplitOrder: boolean;
    notes: string;
    internalMemo: string;
    memoDate: Date;
    memoBy: string;
    remark?: string;
    isPriceExcludeVat: boolean;
    salesOrderItemResource: SalesOrderItemResource[]; // Array of SalesOrderItemResource
}
