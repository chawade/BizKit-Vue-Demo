export interface ColumnDef {
    field: string;
    header?: string;
    sortable?: boolean;
    class?: string;
    headerClass?: string;
    filterable?: boolean;
    filterField?: string;
  }