import type { PaymentTermListResource } from "./PaymentTerm";

export interface CustomerResource {
    customerId: number;
    customerCode: string;
    customerName: string;
    customerNameEng: string;
    customerType: string;
    taxId: string;
    branchCode: string;
    fax: string;
    website: string;
    telNo1: string;
    telNo2: string;
    contactName: string;
    contactEmail: string;
    contactTelNo: string;
    paymentTerm: PaymentTermListResource | null;
    customerGroup: any;
    personInCharge: string;
    billingAddress1: string;
    billingAddress2: string;
    billingAmphur: string;
    billingProvince: string;
    billingPostalCode: string;
    billingCountry: string;
    shippingAddress1: string;
    shippingAddress2: string;
    shippingAmphur: string;
    shippingProvince: string;
    shippingPostalCode: string;
    shippingCountry: string;
    currency: string;
    priceTier: number;
    customerBalance: number;
    creditLimit: number;
    creditBalance: number;
    arAccount: any[];
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