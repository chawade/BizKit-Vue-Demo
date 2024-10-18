import type { StatusResource } from "./Status";

export interface stockTakingHeader {
  takingId: number;
  takingNo: string;
  takingDate: string;
  warehouseId: number;
  warehouseName: string;
  locationId: number | null;
  locationName: string;
  shelfCode: string | null;
  personInCharge: string;
  status: StatusResource;
  remark: string;
  cancelApproveReason: string;
  cancelApproveBy: string;
  cancelApproveDate: string;
  stockTakingItems: stockTakingItem[];
}

export interface stockTakingHeaderSave {
  takingId: number;
  takingNo: string;
  takingDate: Date;
  warehouseId: number;
  locationId: number | null;
  personInCharge: string;
  statusCode: number;
  remark: string;
  stockTakingItems: stockTakingItem[];
}

export interface stockTakingItem {
  takingItemId: number;
  takingId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  shelfCode: string | null;
  lotNo: string | null;
  expiryDate: string | null;
  unitCost: number;
  stockQuantity: number;
  actualQuantity: number;
  stockOnHand: number | null;
  diffQuantity: number;
  unit: string;
  notes: string;
  costMethod: number;
}

export interface stockTakingHeaderList {
  takingId: number;
  takingNo: string;
  takingDate: string;
  warehouseId: number;
  warehouseName: string;
  locationName: string;
  personInCharge: string;
  status: StatusResource;
}
