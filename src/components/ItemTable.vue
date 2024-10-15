<template>
  <DataTable :value="items" :rows="rowsPerPage" :dataKey="dataKey" :loading="loading"
    :rowsPerPageOptions="rowsPerPageOptions" :paginator="true" :lazy="lazy" :totalRecords="totalRecords"
    :scrollHeight="scrollHeight" :tableStyle="tableStyle" filterDisplay="menu" :selection="selectedItems"
    selectionMode="multiple" @update:selection="onSelectionChange" @page="onPageChange" @sort="onSort">
    <!-- Header -->
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <!-- Body -->
    <Column v-if="selectedColumns.length > 0" header="" style="width: 5%">
      <template #body="{ data }">
        <Button type="button" icon="pi pi-cog" class="p-button-text" @click="toggleMenu" aria-haspopup="true"
          aria-controls="overlay_menu" />
        <Menu ref="menuRef" id="overlay_menu" :model="menu" :popup="true" />
      </template>
    </Column>
    <Column v-if="selectionMode === 'multiple' && selectedColumns.length > 0" selectionMode="multiple"
      headerStyle="width: 3rem">
    </Column>
    <Column v-for="col in selectedColumns" :key="col.field" :field="col.field" :sortable="col.sortable"
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
      <template #filter="{ filterModel }" v-if="col.filterable">
        <InputText v-model="filterModel.value" type="text" class="p-column-filter"
          :placeholder="`Search ${col.header}`" />
      </template>
    </Column>

    <!-- Footer -->
    <template #footer>
      <slot name="footer">
        <div class="p-text-center p-m-4">
          <MultiSelect v-model="selectedColumns" :options="columns" optionLabel="header" @change="onColumnToggle"
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
import { ref, computed, watch } from 'vue'
import DataTable, { type DataTablePageEvent, type DataTableRowUnselectEvent, type DataTableSelectAllChangeEvent, type DataTableSortEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Checkbox from 'primevue/checkbox'
import type Menu from 'primevue/menu'
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable'

const menuRef = ref<InstanceType<typeof Menu> | null>(null);

// Define props
const props = defineProps<{
  items: any[] |  undefined | null
  columns: ColumnDef[]
  dataKey: string
  loading: boolean
  lazy: boolean
  totalRecords: number
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
  scrollHeight?: string
  tableStyle?: string
  selectionMode?: 'single' | 'multiple' | null
  menu: any[]
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:selection', selection: any[]): void
  (e: 'page', event: DataTablePageEvent): void
  (e: 'sort', event: DataTableSortEvent): void
  (e: 'filter', filters: any): void
}>()

// Component logic
const selectedColumns = ref<ColumnDef[]>(props.columns)
const selectedItems = ref<any[]>([]);
const isAllSelected = ref(false);

// Computed properties
const rowsPerPage = computed(() => props.rowsPerPage || 10)

// Methods
// const updateDataTableSelection = () => {
//   selectedItems.value = []
//   if (props.items && isAllSelected.value) {
//     selectedItems.value = props.items;
//   }
// };

const onPageChange = (event: DataTablePageEvent) => {
  emit('page', event);
  // Apply the current selection state to the new page
  // updateDataTableSelection();
}

const onSelectionChange = (newSelection: any[]) => {
  selectedItems.value = newSelection;
  // updateDataTableSelection();
  emit('update:selection', newSelection);
};

const toggleMenu = (event: Event) => {
  menuRef.value?.toggle(event);
};

const onSort = (event: DataTableSortEvent) => {
  emit('sort', event)
}

const onColumnToggle = (event: { value: ColumnDef[] }) => {
    selectedColumns.value = event.value;
};

// Watch for changes in props.columns and update selectedColumns
watch(() => props.columns, (newColumns) => {
  selectedColumns.value = newColumns
}, { deep: true })

</script>

<style scoped>
/* Add any component-specific styles here */
</style>