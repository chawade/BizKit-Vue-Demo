<template>
  <DataTable :value="items" :rows="dataTableStore.rowsPerPage" :dataKey="dataKey" :loading="loading"
    :rowsPerPageOptions="rowsPerPageOptions" :paginator="true" :lazy="lazy" :totalRecords="dataTableStore.totalRecords"
    :scrollHeight="scrollHeight" :tableStyle="tableStyle" filterDisplay="menu" v:selection="dataTableStore.selectedItems"
    @update:selection="onSelectionChange" @page="onPageChange" @sort="onSort">
    
    <!-- Header -->
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
      <Tag v-if="!dataTableStore.isAllSelected && dataTableStore.selectedItems.length > 0 && dataTableStore.selectedItems.length == dataTableStore.rowsPerPage"
        style="width: 100%; min-height: 50px" severity="info">
        <span class="font-bold text-base">คุณเลือกรายการทั้ง {{ dataTableStore.rowsPerPage }} รายการในหน้านี้</span>
        <Button link :label="`เลือกทั้ง ${dataTableStore.totalRecords} รายการในเอกสารทั้งหมด`" @click="selectAll" />
      </Tag>
      <Tag v-if="dataTableStore.isAllSelected"
        style="width: 100%; min-height: 50px" severity="info">
        ทั้ง {{ dataTableStore.totalRecords }} รายการถูกเลือกอยู่
        <Button link label="ล้างการเลือก" @click="clearSelection" />
      </Tag>
    </template>

    <!-- Body -->
    <Column v-if="dataTableStore.selectedColumns.length > 0" header="" style="width: 5%">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" class="p-button-text" @click="toggleMenu" aria-haspopup="true"
          aria-controls="overlay_menu" />
        <Menu ref="menuRef" id="overlay_menu" :model="dataTableStore.menu" :popup="true" />
      </template>
    </Column>

    <!-- Column rendering loop -->
    <Column v-for="col in dataTableStore.selectedColumns" :key="col.field" :field="col.field" :sortable="col.sortable"
      :style="col.class" :show-filter-menu="col.filterable" :filter-field="col.filterField">
      <template #header="slotProps">
        <div :class="col.headerClass">
          {{ col.header }}
        </div>
      </template>
      <template #body="slotProps">
        <slot :name="col.field" :data="slotProps.data">
          <div :class="col.class">
            {{ slotProps.data[col.field] }}
          </div>
        </slot>
      </template>
    </Column>

    <!-- Footer -->
    <template #footer>
      <slot name="footer">
        <div class="p-text-center p-m-4">
          <MultiSelect v-model="dataTableStore.selectedColumns" :options="columns" :minSelectedLabels="2" optionLabel="header" @change="onColumnToggle"
            display="chip" placeholder="Select Columns" class="w-full" />
        </div>
      </slot>
    </template>

    <!-- Empty data -->
    <template #empty>
      <slot name="empty">
        <div class="p-text-center p-m-4">
          <Tag style="width: 100%; min-height: 70px" severity="secondary" value="No records available" />
        </div>
      </slot>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { useDataTableStore } from '@/store/useDataTableStore';
import { watch,onMounted, ref, onUnmounted } from 'vue';
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable';
import type Menu from 'primevue/menu';
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable';

// Define props
const props = defineProps<{
  items: any[] | undefined | null
  columns: ColumnDef[]
  dataKey: string
  loading: boolean
  lazy: boolean
  totalRecords: number
  rowsPerPageOptions?: number[]
  scrollHeight?: string
  tableStyle?: string
  pageIdentifier: string
}>()

const menuRef = ref<InstanceType<typeof Menu> | null>(null);
const dataTableStore = useDataTableStore();
const localStorageKey = `${props.pageIdentifier}_selectedColumns`;


// Methods
const onSelectionChange = (newSelection: any[]) => {
  dataTableStore.selectItems(newSelection);
};

const onPageChange = (event: DataTablePageEvent) => {
  dataTableStore.setPage(event.page + 1);
  dataTableStore.setRowsPerPage(event.rows);
};

const onSort = (event: DataTableSortEvent) => {
  console.log('Sorting:', event);
};

const selectAll = () => {
  dataTableStore.selectAll(props.items || []);
};

const clearSelection = () => {
  dataTableStore.clearSelection();
};

const onColumnToggle = (event: { value: any[] }) => {
  if (dataTableStore.selectedColumns.length === 1) {
    // Prevent removing the last column
    return
  }
  dataTableStore.setSelectedColumns(event.value);
  persistSelectedColumns(event.value); // Save to localStorage
};

const toggleMenu = (event: Event) => {
  menuRef.value?.toggle(event);
};

const persistSelectedColumns = (selectedColumns: ColumnDef[]) => {
  localStorage.setItem(localStorageKey, JSON.stringify(selectedColumns));
};

const loadSelectedColumns = () => {
  const storedColumns = localStorage.getItem('selectedColumns');
  if (storedColumns) {
    const parsedColumns = JSON.parse(storedColumns);
    dataTableStore.setSelectedColumns(parsedColumns); // Load from localStorage
  } else {
    dataTableStore.setSelectedColumns(props.columns); // Default to all columns
  }
};

// Load selected columns when component mounts
onMounted(() => {
  debugger
  loadSelectedColumns();
  dataTableStore.setTotalRecords(props.totalRecords);
});

watch(() => props.columns, (newColumns: ColumnDef[]) => {
  dataTableStore.setSelectedColumns(newColumns);
}, { immediate: true });
</script>


<style scoped>
/* Add any component-specific styles here */
</style>
