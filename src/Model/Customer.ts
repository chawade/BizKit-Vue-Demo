import type { PaymentTermListResource } from "./PaymentTerm";

export interface CustomerResource {
    CustomerId: number;
    CustomerCode: string;
    CustomerName: string;
    CustomerNameEng: string;
    CustomerType: string;
    TaxId: string;
    BranchCode: string;
    Fax: string;
    Website: string;
    TelNo1: string;
    TelNo2: string;
    ContactName: string;
    ContactEmail: string;
    ContactTelNo: string;
    PaymentTerm: PaymentTermListResource | null;
    CustomerGroup: any;
    PersonInCharge: string;
    BillingAddress1: string;
    BillingAddress2: string;
    BillingAmphur: string;
    BillingProvince: string;
    BillingPostalCode: string;
    BillingCountry: string;
    ShippingAddress1: string;
    ShippingAddress2: string;
    ShippingAmphur: string;
    ShippingProvince: string;
    ShippingPostalCode: string;
    ShippingCountry: string;
    Currency: string;
    PriceTier: number;
    CustomerBalance: number;
    CreditLimit: number;
    CreditBalance: number;
    ArAccount: any[];
}




class PaymentTermResource {
    // Define properties here
}

class CustomerGroupResource {
    // Define properties here
}

class AccountCodeResource {
    // Define properties here
}