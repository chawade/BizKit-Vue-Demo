<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="!stockTakingData">
    <ConfirmDialog></ConfirmDialog>
  </div>
  <div v-else class="stock-taking-detail">
    <div class="card">
      <ActionButtons :actions="actions" createRoute="/StockTaking/Maintain/" createButtonLabel="Create Stock Taking"
        @start-taking="startTaking" @save-plan="savePlan" @approve="approve" @cancel="cancel"
        @cancel-approve="cancelApprove" @edit="edit" @back-to-list="backToList" />

      <DetailHeader title="Stock Taking Detail" :itemNo="stockTakingData.TakingNo" :status="stockTakingData.Status.StatusName" />

      <InfoBox title="Stock Taking Info" :info="{
        'Warehouse Name': stockTakingData.WarehouseName,
        'Location': stockTakingData.LocationName,
        'Taking Date':  stockTakingData.TakingDate ? new Date(stockTakingData.TakingDate).toLocaleDateString() : ' ',
        'PIC': stockTakingData.PersonInCharge
      }" />

      <ItemTable
        class="mb-3" 
        :data="stockTakingData.StockTakingItems" 
        :columns="columns" 
        tableStyle="min-width: 50rem"
        :rows="stockTakingData.StockTakingItems.length"
        scrollHeight="auto"
        dataKey="ItemCode"
      />      

        <Remark title="Remark" :remark="stockTakingData.Remark" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StockTakingService from '@/service/stockTakingService';
import ActionButtons from '@/components/ActionButtons.vue';
import DetailHeader from '@/components/DetailHeader.vue';
import InfoBox from '@/components/InfoBox.vue';
import ItemTable from '@/components/ItemTable.vue';
import Remark from '@/components/Remark.vue';
import { firstValueFrom } from 'rxjs';

const stockTakingData = ref();
const loading = ref(true);
const error = ref<string>();
const route = useRoute();
const router = useRouter();
const takingId = Number(route.params.id);

const actions = [
  { label: "Start Taking", severity: "warn", event: "start-taking" },
  { label: "Save Plan", severity: "warn", event: "save-plan" },
  { label: "Adjust Stock", severity: "primary", event: "approve" },
  { label: "Cancel", severity: "primary", event: "cancel" },
  { label: "Cancel Approve", severity: "primary", event: "cancel-approve" },
  { label: "Edit", severity: "primary", event: "edit" },
  { label: "Back", severity: "primary", event: "back-to-list" }
];

const props = defineProps({
  stockTakingData: {
    type: Object,
    required: true
  }
});

const columns = [
  { field: 'ItemCode', header: 'Item Code' },
  { field: 'ItemName', header: 'Item Name' },
  { field: 'LotNo', header: 'Lot/Serial No.' },
  { field: 'ExpiryDate', header: 'Expiry Date' },
  { field: 'StockQuantity', header: 'Stock Quantity' },
  { field: 'ActualQuantity', header: 'Actual Quantity' },
  { field: 'DiffQuantity', header: 'Difference' },
  { field: 'Unit', header: 'Unit' },
  { field: 'Remark', header: 'Remark' }
];

const fetchData = async (takingId: number) => {
  try {
    const response = await firstValueFrom(StockTakingService.get(takingId));
    console.log('Stock taking by ID:', response);
    stockTakingData.value = response.Data;
  } catch (error) {
    console.error(`Error fetching stock taking by ID ${takingId}:`, error);
  }
};

const updateStatus = async (takingId: number[], status?: number) => {
  try {
    const response = await firstValueFrom(StockTakingService.updateStatus(takingId, status));
    console.log('Status updated:', response);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const startTaking = () => updateStatus([takingId],175);
const savePlan = () => updateStatus([takingId], 150);

const approve = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(StockTakingService.approve(takingId));
    console.log('Approved stock taking:', response);
  } catch (error) {
    console.error('Error approving stock taking:', error);
  }
};

const cancelApprove = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(StockTakingService.cancelApprove(takingId));
    console.log('Cancelled approval:', response);
  } catch (error) {
    console.error('Error cancelling approval:', error);
  }
};

const cancel = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(StockTakingService.cancel(takingId));
    console.log('Cancelled stock taking:', response);
  } catch (error) {
    console.error('Error cancelling stock taking:', error);
  }
};

const edit = async () => {
  router.push(`/StockTaking/Maintain/${takingId}`);
}

const backToList = async () => {
  router.push(`/StockTaking/List`);
}

onMounted(() => {
    fetchData(takingId);
});
</script>

<style scoped></style>