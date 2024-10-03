<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="row">
      <!-- <div class="col-sm-8">
        <button v-if="stockTakingData.Permission.MODIFY && stockTakingData.Status < 2" class="btn btn-warning btn-outline" @click="savePlan">
          <i class="fa fa-check-circle"></i> Save Plan
        </button>
        <button v-if="stockTakingData.Permission.APPROVE && stockTakingData.Status < 4" class="btn blue btn-outline" @click="approve">
          <i class="fa fa-check-circle"></i> Approve
        </button>
        <button v-if="stockTakingData.Permission.MODIFY && stockTakingData.Status !== 3 && stockTakingData.Status < 4" class="btn blue btn-outline" @click="editStock">
          <i class="fa fa-pencil"></i> Edit
        </button>
        <button v-if="stockTakingData.Permission.PRINT" class="btn blue btn-outline" @click="print">
          <i class="fa fa-print"></i> Print
        </button>
        <div class="dropdown" style="display: inline-block; margin: 0">
          <button class="btn blue btn-outline dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            More Action
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li v-if="stockTakingData.Permission.MODIFY">
              <a href="#" @click.prevent="copyStockTaking">
                <i class="fa fa-files-o"></i> Copy
              </a>
            </li>
            <li v-if="stockTakingData.Permission.MODIFY && stockTakingData.Status < 4">
              <a href="#" @click.prevent="cancel">
                <span class="text-danger"><i class="fa fa-trash-o"></i> Cancel</span>
              </a>
            </li>
          </ul>
        </div>
        <button class="btn blue btn-outline" @click="goBackToList">
          <i class="fa fa-arrow-left"></i> Back
        </button>
      </div>
      <div class="col-sm-4 text-right">
        <a v-if="stockTakingData.Permission.MODIFY" @click="newStockTaking" class="bz-createbtn">
          <i class="fa fa-plus-circle"></i> Create Stock Taking
        </a>
      </div> -->
      <button @click="goBackToList">BACK</button>
      <button @click="savePlan">Save Plan</button>
      <button @click="approve">Adjust Stock</button>
      <button @click="cancel">Cancel</button>
      <button @click="cancelApprove">Cancel Approve</button>
      <button @click="editStock">Edit</button>
    </div>

    <div class="row invoice-head">
      <div class="col-sm-7">
        <div class="invoice-logo">
          <h1 class="uppercase text-left">
            <span>Stock Taking Detail</span>
          </h1>
        </div>
      </div>
      <div class="col-sm-5 text-right">
        <h4>{{ stockTakingData.TakingNo }}</h4>
        <span :style="{
          display: 'inline-block',
          backgroundColor: stockTakingData.Status.StatusBgColor,
          borderColor: stockTakingData.Status.StatusBorderColor,
          fontSize: stockTakingData.Status.StatusFontSize + 'px',
          color: stockTakingData.Status.StatusFontColor
        }">{{ stockTakingData.Status.StatusName }}</span>
      </div>
    </div>

    <div class="row invoice-cust-add">
      <div class="col-sm-5">
        <div class="portlet bz-default box">
          <div class="portlet-title">
            <div class="caption">
              <span class="invoice-title uppercase">Stock Taking Info</span>
            </div>
          </div>
          <div class="portlet-body">
            <div class="row stattic-info">
              <span class="invoice-desc col-sm-6">Warehouse Name</span>
              <span class="col-sm-6 font-normal">{{ stockTakingData.WarehouseName }}</span>
            </div>
            <div class="row stattic-info">
              <span class="invoice-desc col-sm-6">Location</span>
              <span class="col-sm-6 font-normal">{{ stockTakingData.LocationName }}</span>
            </div>
            <div class="row stattic-info">
              <span class="invoice-desc col-sm-6">Taking Date</span>
              <span class="col-sm-6 font-normal">{{ stockTakingData.TakingDate }}</span>
            </div>
            <div class="row stattic-info">
              <span class="invoice-desc col-sm-6">PIC</span>
              <span class="col-sm-6 font-normal">{{ stockTakingData.PersonInCharge }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row invoice-body">
      <div class="col-xs-12 table-wrapper">
        <table class="table table-hover table-striped bz-table-fix-header" id="prList">
          <thead style="background-color:#fcfcfc">
            <tr role="row">
              <th width="10%" class="text-left">Item Code</th>
              <th width="12%" class="text-left">Item Name</th>
              <th width="8%" class="text-left">Lot No</th>
              <th width="8%" class="text-center">Expiry Date</th>
              <th width="5%" class="text-right">Stock Qty</th>
              <th width="5%" class="text-right">Actual Qty</th>
              <th width="5%" class="text-right">Difference</th>
              <th width="4%" class="text-center">UOM</th>
              <th width="10%" class="text-left">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in stockTakingData.StockTakingItems" :key="item.TakingItemId" style="height:50px">
              <td class="text-left">{{ item.ItemCode }}</td>
              <td class="text-left">{{ item.ItemName }}</td>
              <td class="text-left">{{ item.LotNo }}</td>
              <td class="text-center">{{ item.ExpiryDate }}</td>
              <td class="text-right">{{ item.StockQuantity }}</td>
              <td class="text-right">{{ item.ActualQuantity }}</td>
              <td class="text-right">{{ item.DiffQuantity }}</td>
              <td class="text-center">{{ item.Unit }}</td>
              <td class="text-left">{{ item.Notes }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-5">
        <div class="portlet bz-default box">
          <div class="portlet-title">
            <div class="caption">
              <span class="invoice-title uppercase">Remark</span>
            </div>
          </div>
          <div class="portlet-body">
            {{ stockTakingData.Remark }}
          </div>
        </div>
      </div>
    </div>

    <!-- Activity History section can be added here -->

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { StockTakingService } from '@/Service/stockTakingService'

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
  console.log('Save plan');
};

const approve = async () => {
  console.log('Approved');
  try {
    loading.value = true;
    const TakingId = [route.params.id];
    await StockTakingService.approve(route.params.id, TakingId);
    fetchStockTakingData();
  } catch (err) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  }
};

const cancelApprove = async () => {
  console.log("Cancel approve!");
  try {
    loading.value = true;
    const TakingId = [route.params.id];
    await StockTakingService.cancelApprove(route.params.id, TakingId);
    fetchStockTakingData();
  } catch (err) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  }
};

const cancel = async () => {
  console.log("Cancel!");
  try {
    loading.value = true;
    const TakingId = [route.params.id];
    await StockTakingService.cancel(route.params.id, TakingId);
    fetchStockTakingData();
  } catch (err) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  }
};

const editStock = () => {
  console.log('Edit');
  const id = route.params.id;
  router.push(`/StockTaking/Maintain/${id}`);
};

const goBackToList = () => {
  router.push('/StockTaking/List');
};

const print = () => {
  // Implement print functionality
  console.log('Print');
};

const copyStockTaking = () => {
  // Implement copy functionality
  console.log('Copy Stock Taking');
};

const newStockTaking = () => {
  // Implement new stock taking functionality
  console.log('New Stock Taking');
};

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
