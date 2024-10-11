<template>
  <DataTable 
    :value="data" 
    :rows="rows" 
    :paginator="showPaginator" 
    :rowsPerPageOptions="[5, 10, 25]" 
    scrollable
    :scrollHeight="scrollHeight" 
    :tableStyle="tableStyle" 
    v-model:selection="selectedItems" 
    :dataKey="dataKey"
    @row-select="onRowSelect" 
    @row-unselect="onRowUnselect"
    >
    <slot name="header"></slot>
    <Column v-if="selectable" selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <template v-for="column in columns" :key="column.field">
      <Column v-bind="column">
        <template #body="slotProps" v-if="column.customBody">
          <slot :name="column.field" :data="slotProps.data"></slot>
        </template>
      </Column>
    </template>
    <slot name="footer"></slot>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

interface ColumnDef {
  field: string;
  header: string;
  customBody?: boolean;
  [key: string]: any;
}

interface ItemTableProps {
  data: any[];
  columns: ColumnDef[];
  tableStyle?: string;
  selectable?: boolean;
  rows?: number;
  scrollHeight?: string;
  dataKey?: string;
}

const props = withDefaults(defineProps<ItemTableProps>(), {
  tableStyle: 'min-width: 50rem',
  selectable: false,
  rows: 10,
  scrollHeight: '400px',
  dataKey: 'id'
});

const emit = defineEmits<{
  (e: 'update:selectedItems', items: any[]): void;
  (e: 'rowSelect', data: any): void;
  (e: 'rowUnselect', data: any): void;
}>();

const selectedItems = ref<any[]>([]);

const showPaginator = computed(() => props.data.length > props.rows);

const onRowSelect = (event: { data: any }) => {
  emit('rowSelect', event.data);
  emit('update:selectedItems', selectedItems.value);
};

const onRowUnselect = (event: { data: any }) => {
  emit('rowUnselect', event.data);
  emit('update:selectedItems', selectedItems.value);
};
</script>