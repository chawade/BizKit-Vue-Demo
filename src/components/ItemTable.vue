<template>
  <div class="row invoice-body mb-8">
    <div class="col-xs-12 table-wrapper">
      <DataTable :value="items" :tableStyle="tableStyle">
        <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header">
          <template #body="slotProps" v-if="col.template">
            <slot :name="col.field" v-bind="slotProps">
              {{ slotProps.data[col.field] }}
            </slot>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface TableColumn {
  field: string;
  header: string;
  template?: boolean;
}

defineProps<{
  items: any[];
  columns: TableColumn[];
  tableStyle?: string;
}>();
</script>