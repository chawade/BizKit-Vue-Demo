import type { CommonSearch } from "./GlobalVariable/Common";

export interface ItemSearch extends CommonSearch {
    itemNameEn?: string;
    itemCodeName?: string;
    warehouseID?: number;
    categoryID?: number;
    itemCode?: string;
    itemName?: string;
    availableQtyFrom?: number;
    availableQtyTo?: number;
    onHandQtyFrom?: number;
    onHandQtyTo?: number;
}