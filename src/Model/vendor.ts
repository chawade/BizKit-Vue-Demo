import type { StatusResource } from "./Status";

export interface VendorResource {
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
    vendorSince: Date;
    leadTime: number;
    remark: string;
    apAccountId: number;
    status: StatusResource;
}
