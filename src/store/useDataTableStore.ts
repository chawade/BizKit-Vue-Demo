import type { ColumnDef } from "@/Model/GlobalVariable/DataTable";
import { defineStore } from "pinia";

export const useDataTableStore = defineStore('dataTableStore', {
    state: () => ({
        selectedItems: [] as any[],
        selectedColumns: [] as ColumnDef[],
        isAllSelected: false,
        currentPage: 1,
        rowsPerPage: 10,
        totalRecords: 0,
        menu: [] as any[],
    }),
    actions: {
        // Selection management
        selectItems(items: any[]) {
            this.selectedItems = items;
        },
        selectAll(items: any[]) {
            this.selectedItems = items;
            this.isAllSelected = true;
        },
        clearSelection() {
            this.selectedItems = [];
            this.isAllSelected = false;
        },

        // Pagination
        setPage(page: number) {
            this.currentPage = page;
        },
        setRowsPerPage(rows: number) {
            this.rowsPerPage = rows;
        },
        setTotalRecords(total: number) {
            this.totalRecords = total;
        },

        // Column selection management
        setSelectedColumns(columns: ColumnDef[]) {
            this.selectedColumns = columns;
        },

        // Menu management
        setMenu(menu: any[]) {
            this.menu = menu;
        },
    },
});