<template>
  <h1>StockTaking Details</h1>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="row">
      <!-- <pre>{{ JSON.stringify(stockTakingData, null, 2) }}</pre>  -->

      <button v-click="savePlan">บันทึกแผน</button>
      <button v-click="startTaking">เริ่มตรวจนับ</button>
      <button v-click="approveStock">อนุมัติ</button>
      <button v-click="editStock">แก้ไขข้อมูล</button>

      <p><strong>Taking No:</strong> {{ stockTakingData.TakingNo }}</p>
      <p><strong>Taking Date:</strong> {{ stockTakingData.TakingDate }}</p>
      <p><strong>Warehouse:</strong> {{ stockTakingData.WarehouseName }}</p>
      <!-- <p>Status: <span :style="getStatusStyle">{{ stockTakingData.Status.StatusName }}</span></p> -->
      <p><strong>Status:</strong> {{ stockTakingData.Status.StatusName }}</p>
      <p><strong>Remark:</strong> {{ stockTakingData.Remark }}</p>

      <h2>Stock Taking Items</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Shelf Code</th>
            <th>Lot No</th>
            <th>Expiry Date</th>
            <th>Stock Quantity</th>
            <th>Actual Quantity</th>
            <th>Difference</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in stockTakingData.StockTakingItems" :key="item.TakingItemId">
            <td>{{ item.ItemId }}</td>
            <td>{{ item.ShelfCode }}</td>
            <td>{{ item.LotNo }}</td>
            <td>{{ item.ExpiryDate }}</td>
            <td>{{ item.StockQuantity }}</td>
            <td>{{ item.ActualQuantity }}</td>
            <td>{{ item.DiffQuantity }}</td>
            <td>{{ item.Notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { StockTakingService } from '@/Service/stockTakingService.js'

const stockTakingData = ref();
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();

const fetchStockTakingData = async () => {
  try {
    const TakingId = route.params.id;
    const response = await StockTakingService.get(TakingId);
    stockTakingData.value = response.Data;
  } catch (err) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const savePlan = () => {
  console.log('บันทึกแผน');
};
const startTaking = () => {
  console.log('เริ่มตรวจนับ');
};
const approveStock = () => {
  console.log('อนุมัติ');
};
const editStock = () => {
  console.log('แก้ไขข้อมูล');
  
};

// const getStatusStyle = computed(() => {
//             if (stockTakingData.value && stockTakingData.value.Status) {
//             return {
//             backgroundColor: stockTakingData.value.Status.StatusBgColor,
//             color: stockTakingData.value.Status.StatusFontColor,
//             borderColor: stockTakingData.value.Status.StatusBorderColor,
//             fontSize: `${stockTakingData.value.Status.StatusFontSize}px`,
//             padding: '3px 8px',
//             borderRadius: '4px',
//             display: 'inline-block'
//             };
//             }
//             return {};
//             }); 

onMounted(fetchStockTakingData);

</script>

<style scoped>
.tabhwtbg {
  background-color: #f4f3f3;
  border: 1px solid #e5e5e5;
  float: left;
  height: auto !important;
  line-height: 1.5em;
  margin-top: 20px;
  min-height: 180px;
  padding: 3px;
  width: 420px;
}

.hoverTable {
  width: 100%;
  border-collapse: collapse;
}

.hoverTable tbody td {
  padding: 7px;
  /*border: #4e95f4 1px solid;*/
}

.hoverTable tbody tr {
  background: white;
}

.hoverTable tbody tr:hover {
  background-color: #f6f6f6;
}
</style>
