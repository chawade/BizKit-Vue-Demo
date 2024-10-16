import type { StatusResource } from "./Status";

export interface VendorResource {
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
    VendorSince: Date;
    LeadTime: number;
    Remark: string;
    APAccountId: number;
    Status: StatusResource;
}
  
