<template>
  <div class="card">
    <div id="alertmsg" class="alert alert-danger" v-if="showAlert">
      <button type="button" @click="hideDivMSG" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <span id="lblMsg">{{ alertMsg }}</span>
    </div>

    <table>
      <tbody id="prList">
        <tr v-for="(item, index) in stockItems" :key="index">
          <td style="text-align:center">
            <input v-model="item.actualQty" @change="onActualQtyChange(item)" type="number" class="txtActualQty" />
          </td>
          <td>
            <span>{{ formatNumber(item.diff, '.', ',', qtyDecPlaces) }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="saveStockTaking('DRAFT')" id="btnSave">Save</button>
    <button @click="saveStockTaking('PLANNED')" id="btnSavePlan">Save Plan</button>
    <button @click="saveStockTaking('APPROVED')" id="btnSaveAndApprove">Save and Approve</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const showAlert = ref(false);
const alertMsg = ref('');
const qtyDecPlaces = ref(2);
const stockItems = ref<any[]>([]);
const oldWarehouseId = ref(0);
const oldLocationId = ref(0);
const warehouseId = ref(0);
const locationId = ref(0);
const takingDate = ref('');
const status = ref<'DRAFT' | 'PLANNED' | 'APPROVED'>('DRAFT');

// Methods
const hideDivMSG = () => {
  showAlert.value = false;
};

const formatNumber = (number: number, decimalSeparator: string, thousandSeparator: string, decimalPlaces: number) => {
  return number
    .toFixed(decimalPlaces)
    .replace(/\d(?=(\d{3})+\.)/g, `$&${thousandSeparator}`);
};

const onActualQtyChange = (item: any) => {
  item.diff = item.actualQty - item.onHandQty;
};

const saveStockTaking = (newStatus: 'DRAFT' | 'PLANNED' | 'APPROVED') => {
  if (validateStockTaking()) {
    if (validateTable()) {
      status.value = newStatus;
      submitStockTaking();
    } else {
      showAlert.value = true;
      alertMsg.value = 'Please fill required fields.';
    }
  }
};

const validateStockTaking = () => {
  let isValid = true;
  if (!takingDate.value) {
    alertMsg.value = 'Stock Taking Date is required.';
    isValid = false;
  }
  if (warehouseId.value === 0) {
    alertMsg.value = 'Warehouse is required.';
    isValid = false;
  }
  return isValid;
};

const validateTable = () => {
  return stockItems.value.every((item) => item.actualQty !== null && item.actualQty !== '');
};

const submitStockTaking = () => {
  console.log('Stock-taking submitted with status:', status.value);
};

const getStockItems = async (warehouseId: number, locationId: number) => {
  try {
    const response = await axios.post('/StockTaking/GetStockItemForTaking', {
      warehouseId,
      locationId,
    });
    stockItems.value = response.data.items;
  } catch (error) {
    console.error('Error fetching stock items:', error);
  }
};

onMounted(() => {
  getStockItems(warehouseId.value, locationId.value);
});
</script>

<style scoped>
</style>
