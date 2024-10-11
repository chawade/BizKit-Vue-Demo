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
    salesOrderItemID: number;
    salesOrderNumber: string;
    companyID: number;
    lineNumber: number;
    itemID: number;
    itemCode: string;
    itemname: string;
    deliveryDate: Date;
    unitCost: number;
    baseUnitPrice: number;
    unitPrice: number;
    avaliableQty: number;
    orderQty: number;
    unit: string;
    unitID: number;
    baseUnit: string;
    baseUnitID: number;
    conversionQty: number;
    baseUnitQty: number;
    discountRate: number;
    discountAmount: number;
    taxID: number;
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
    selectItem: SelectItem;
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
