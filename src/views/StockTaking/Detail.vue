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

      <DetailHeader title="Stock Taking Detail" :itemNo="stockTakingData.takingNo" :status="stockTakingData.status" />

      <InfoBox title="Stock Taking Info" :info="{
        'Warehouse Name': stockTakingData.warehouseName,
        'Location': stockTakingData.locationName,
        'Taking Date': stockTakingData.takingDate ? new Date(stockTakingData.takingDate).toLocaleDateString() : ' ',
        'PIC': stockTakingData.personInCharge
      }" />

      <DataTable :value="stockTakingItems" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
        columnResizeMode="fit" class="mb-10">
        <!-- LineNumber -->
        <Column field="lineNumber" header="No.">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>

        <!-- Item Code Column -->
        <Column field="itemCode" header="Item Code" class="min-w-40" />

        <!-- Item Name Column -->
        <Column field="itemName" header="Item Name" class="min-w-40" />

        <!-- Shelf Code Column -->
        <Column field="shelfCode" header="Shelf Name" class="min-w-40" />

        <!-- Lot No Column -->
        <Column field="lotNo" header="Lot/Serial No." class="min-w-40" />

        <!-- Expiry Date Column -->
        <Column field="expiryDate" header="Expiry Date" class="min-w-40">
          <template #body="{ data }">
            {{ data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : '' }}
          </template>
        </Column>

        <!-- Stock Quantity Column -->
        <Column field="stockQuantity" header="Stock Qty" class="min-w-40" />

        <!-- Actual Quantity Column -->
        <Column field="actualQuantity" header="Actual Qty" class="min-w-40" />

        <!-- Adjust Quantity Column -->
        <Column field="diffQuantity" header="Adjust Qty" class="min-w-40">
          <template #body="{ data }">
            {{ data.diffQuantity ?? 0 }}
          </template>
        </Column>

        <!-- Unit Column -->
        <Column field="unit" header="Unit" class="min-w-10" />

        <!-- Notes Column -->
        <Column field="notes" header="Notes" class="min-w-40" />

      </DataTable>

      <Remark title="Remark" :remark="stockTakingData.remark" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { stockTakingHeader, stockTakingItem } from '@/Model/stockTaking';
import stockTakingService from '@/service/stockTakingService';
import ActionButtons from '@/components/ActionButtons.vue';
import DetailHeader from '@/components/DetailHeader.vue';
import InfoBox from '@/components/InfoBox.vue';
import Remark from '@/components/Remark.vue';
import { firstValueFrom, Subscription } from 'rxjs';
import { useToast } from 'primevue/usetoast';

let subscription: Subscription;
const toast = useToast();
const fetchLoading = ref(false);

const stockTakingData = ref<stockTakingHeader>();
const stockTakingItems = ref<stockTakingItem>();
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
  subscription = stockTakingService.get(takingId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingData.value = result.data;
        stockTakingItems.value = result.data.stockTakingItems;
      } else {
        const statusCode = result.statusCode.toString() || 'Unknown';
        const errorMessage = result.error?.message || 'An error occurred';
        toast.add({ severity: 'error', summary: statusCode, detail: errorMessage, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
}

const updateStatus = async (takingId: number[], status?: number) => {
  try {
    const response = await firstValueFrom(stockTakingService.updateStatus(takingId, status));
    console.log('Status updated:', response);
  } catch (error) {
    console.error('Error updating status:', error);
  }
};

const startTaking = () => updateStatus([takingId], 175);
const savePlan = () => updateStatus([takingId], 150);

const approve = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(stockTakingService.approve(takingId));
    console.log('Approved stock taking:', response);
  } catch (error) {
    console.error('Error approving stock taking:', error);
  }
};

const cancelApprove = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(stockTakingService.cancelApprove(takingId));
    console.log('Cancelled approval:', response);
  } catch (error) {
    console.error('Error cancelling approval:', error);
  }
};

const cancel = async (takingId: number[]) => {
  try {
    const response = await firstValueFrom(stockTakingService.cancel(takingId));
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