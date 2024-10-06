<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="stock-taking-detail">
    <div class="card">
      <ActionButtons 
        :actions="actions"
        createRoute="/StockTaking/Maintain/"
        createButtonLabel="Create Stock Taking"
        @start-taking="startTaking"
        @save-plan="savePlan"
        @approve="approve"
        @cancel="cancel"
        @cancel-approve="cancelApprove"
        @back-to-list="backToList"
      />
      
      <DetailHeader 
        title="Stock Taking Detail"
        :itemNo="stockTakingData.TakingNo"
        :status="stockTakingData.Status"
      />

      <InfoBox
        title="Stock Taking Info"
        :info="{
          'Warehouse Name': stockTakingData.WarehouseName,
          'Location': stockTakingData.LocationName,
          'Taking Date': stockTakingData.TakingDate,
          'PIC': stockTakingData.PersonInCharge
        }"
      />

      <ItemTable
        :items="stockTakingData.StockTakingItems"
        :columns="columns"
        tableStyle="min-width: 50rem"
      />

      <Remark
        title="Remark"
        :remark="stockTakingData.Remark"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StockTakingService from '@/service/stockTakingService';
import ActionButtons from '@/components/ActionButtons.vue';
import DetailHeader from '@/components/DetailHeader.vue';
import InfoBox from '@/components/InfoBox.vue';
import ItemTable from '@/components/ItemTable.vue';
import Remark from '@/components/Remark.vue';

const stockTakingData = ref();
const loading = ref(true);
const error = ref<string>();
const route = useRoute();
const router = useRouter();
const takingId = Number(route.params.id);

const actions = [
  { label: "Start Taking", severity: "warn", event: "start-taking" },
  { label: "Save Plan", severity: "warn", event: "save-plan" },
  { label: "Adjust Stock", severity: "info", event: "approve" },
  { label: "Cancel", severity: "info", event: "cancel" },
  { label: "Cancel Approve", severity: "info", event: "cancel-approve" },
  { label: "Back", severity: "info", event: "back-to-list" }
];

const columns = [
  { field: "ItemCode", header: "Item Code" },
  { field: "ItemName", header: "Item Name" },
  { field: "LotNo", header: "Lot/Serial No." },
  { field: "ExpiryDate", header: "Expiry Date" },
  { field: "StockQuantity", header: "Stock Quantity" },
  { field: "ActualQuantity", header: "Actual Quantity" },
  { field: "DiffQuantity", header: "Difference" },
  { field: "Unit", header: "Unit" },
  { field: "Remark", header: "Remark" }
];

const fetchData = async () => {
  try {
    const response = await StockTakingService.get(takingId);
    stockTakingData.value = response.Data;
  } catch (err: any) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (statusId: number) => {
  try {
    loading.value = true;
    await StockTakingService.updateStatus([takingId], statusId);
    await fetchData();
  } catch (err: any) {
    error.value = `Failed to update status: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const startTaking = () => updateStatus(175);
const savePlan = () => updateStatus(150);

const approve = async () => {
  try {
    loading.value = true;
    await StockTakingService.approve(`/${takingId}`, [takingId]);
    await fetchData();
  } catch (err: any) {
    error.value = `Failed to approve: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const cancelApprove = async () => {
  try {
    loading.value = true;
    await StockTakingService.cancelApprove(`/${takingId}`, [takingId]);
    await fetchData();
  } catch (err: any) {
    error.value = `Failed to cancel approve: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const cancel = async () => {
  try {
    loading.value = true;
    await StockTakingService.cancel(`/${takingId}`, [takingId]);
    await fetchData();
  } catch (err: any) {
    error.value = `Failed to cancel: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const backToList = async () => {
  router.push(`/StockTaking/List`);
}
onMounted(fetchData);
</script>

<style scoped>
</style>