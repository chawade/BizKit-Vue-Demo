export enum DocumentMode {
    ADD = "AD",
    EDIT = "ED",
    CONVERT_TO_INVOICE = "CV",
    CONVERT_SO_TO_INVOICE = "S_TO_IV",
    COPY_TO_NEW_DOCUMENT = "CP",
    EDIT_REVISION = "ED_REV"
}


export interface CommonSearch {
    companyID?: number;
    status?: number;
    pageNo?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    searchString?: string;
    updateBy?: string;
    url?: string;
    ipAddress?: string;
}