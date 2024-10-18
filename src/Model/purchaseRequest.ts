import type { BaseResource, SelectItem } from "./BaseResource";
import type { CustomerResource } from "./Customer";
import type { DepartmentListResource } from "./department";
import type { PaymentTermListResource } from "./PaymentTerm";
import type { ProjectListResource } from "./project";
import type { StatusResource } from "./Status";
import type { VendorResource } from "./vendor";

export interface PurchaseRequest {
  purchaseRequestNo: string;
  purchaseRequestDate: string;
  requireDate: string;
  vendorName: string;
  vendor: VendorResource | null;
  project: string;
  department: string;
  status: StatusResource;
  amount: number;
  referenceNo: string;
  prNoSearchPlaceholder: string;
  remark: string;
  itemCode: string;
  itemName: string;
  selectedItems: boolean;
  totalAmount: number;
  issueDate: string;
  personInCharge: string;
  projectName: '';
  departmentName: '';
  notes: string;
  subtotal: number;
  taxAmount: number;
  otherCharges: number;
  purchaseRequestItem: PurchaseRequestItemResource[];
}

export interface PurchaseRequestResource {
  purchaseRequestNo: string;
  companyId: number;
  purchaseRequestDate: Date;
  customer: CustomerResource | null;
  paymentTerm: PaymentTermListResource;
  referenceNo: string;
  requiredDate: string;
  vendor: VendorResource;
  status: StatusResource;
  deliveryDate: Date;
  dueDate: Date;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryCountry: string;
  personInCharge: string;
  currency: string;
  exchangeRate: number;
  subtotal: number;
  taxAmount: number;
  discountRate?: number;
  discountAmount?: number;
  otherCharges: number;
  totalAmount: number;
  baseTotalAmount: number;
  totalReceivedAmount: number;
  totalReceivedTax: number;
  totalRemainAmount: number;
  notes: string;
  termAndConditions: string;
  templateId?: number;
  purchaseRequestItems: PurchaseRequestItemResource[];
  projectName: '';
  departmentName: '';
}


export interface Vendor {
  vendorId: number;
  companyId: number;
  vendorCode: string | null;
  vendorName: string;
}
export interface Status {
  statusId: number;
  statusName: string;
  localStatusName: string | null;
  statusBgColor: string;
  statusBorderColor: string;
  statusFontColor: string;
  statusFontSize: number;
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
  purchaseRequestNo: string;
  companyId: number;
  purchaseRequestDate: Date;
  termDescription: string;
  referenceNo: string;
  customer: CustomerResource | null;
  paymentTerm: PaymentTermListResource | null;
  vendor: VendorResource | null;
  statusId: number;
  deliveryDate: Date;
  dueDate: Date;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryCountry: string;
  personInCharge: string;
  currency: string;
  exchangeRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  otherCharges: number;
  subtotal: number;
  notes: string;
  termAndConditions: string;
  templateId: number;
  totalAmount: number;
  purchaseRequestItems: PurchaseRequestItemResource[];
  userId: string;
  ipAddress: string;
  url: string;
  project: ProjectListResource | null;
  department: DepartmentListResource | null;
  ddlItem: SelectItem[];
}

export interface VendorSave {
  vendorId: number;
  companyId: number;
  vendorCode: string;
  vendorName: string;
  vendorType: string;
  vendorBalance: number;
  baseVendorBalance: number;
  creditBalance: number;
  contactId: number;
  contactName: string;
  contactEmail: string;
  contactTelNo: string;
  companyName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  telephone1: string;
  telephone2: string;
  email: string;
  fax: string;
  website: string;
  paymentTerm: string;
  currencyCode: string;
  branchFlag: boolean;
  branchCode: string;
  taxId: string;
  vendorSince: string;
  leadTime: number;
  remark: string;
  apAccountId: number;
  status: Status;
}

export interface PurchaseRequestItemResource {
  purchaseRequestItem: any[] | null | undefined;
  purchaseRequestNo: string;
  companyId: number;
  lineNumber: number;
  itemId: number;
  itemCode: string;
  description: string;
  requiredDate: string;
  orderQuantity: number;
  unit: string;
  unitCost: number;
  discountRate: number;
  discountAmount: number;
  vatId: number;
  vatCode: string;
  vatRate: number;
  vatAmount: number;
  lineTotal: number;
  purchaseOrderNo: string;
  referenceNo: string;
  referenceLineNumber: number;
  ddlItem: SelectItem[];
}

export interface PRHeaderSearch {
  companyID: number;
  periodFrom?: Date;
  periodTo?: Date;
  deliveryDateFrom?: Date;
  deliveryDateTo?: Date;

  stringPeriodFrom?: string;
  stringPeriodTo?: string;
  stringDeliveryDateFrom?: string;
  stringDeliveryDateTo?: string;
  stringTotalFrom?: string;
  stringTotalTo?: string;

  remark?: string;
  poNo?: string;
  itemCode?: string;
  itemName?: string;
  totalFrom?: number;
  totalTo?: number;
  detailSearch: boolean;
  prNo?: string;
  status: number;
  vendorID: number;
  referenceNo?: string;
  updateBy?: string;
  url?: string;
  ipAddress?: string;
  vendor: string;
}


