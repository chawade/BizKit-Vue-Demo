<template>
  <div>
    <h3 class="font-bold text-xl mb-8">Stock Taking Detail</h3>
  </div>
  <Breadcrumb :model="breadcrumb" class="card">
    <template #item="{ item, props }">
      <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a :href="href" v-bind="props.action" @click="navigate">
          <span :class="[item.icon, 'text-color']" />
          <span class="text-primary font-semibold">{{ item.label }}</span>
        </a>
      </router-link>
      <a v-else :href="item.url" :target="item.target" v-bind="props.action">
        <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
      </a>
    </template>
  </Breadcrumb>

  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="card">
      <div class="row mb-8 flex justify-between">
        <div class="col-sm-8 flex gap-2">
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
          <Button label="Save Plan" severity="warn" @click="savePlan" />
          <Button label="Adjust Stock" severity="info" @click="approve" />
          <Button label="Cancel" severity="info" @click="cancel" />
          <Button label="Cancel Approve" severity="info" @click="cancelApprove" />
          <router-link :to="`/StockTaking/Maintain/${stockTakingData.TakingId}`" custom v-slot="{ navigate }">
            <Button label="Edit" severity="info" @click="navigate" />
          </router-link>
          <router-link :to="`/StockTaking/List`" custom v-slot="{ navigate }">
            <Button label="BACK" severity="info" @click="navigate" />
          </router-link>
        </div>
        <div class="col-sm-4 text-right">
          <router-link to="/StockTaking/Maintain/0">
            <Button icon="pi pi-plus-circle" label="Create Stock Taking" severity="success" />
          </router-link>
        </div>
      </div>
      <div class="detail-head flex justify-between items-end mb-8">
        <div>
          <h1 class="uppercase font-semibold text-l text-left" style="bottom: 0;">
            <span>Stock Taking Detail</span>
          </h1>
        </div>

        <div class="text-right">
          <h4>{{ stockTakingData.TakingNo }}</h4>
          <span class="status" :style="{
            backgroundColor: stockTakingData.Status.StatusBgColor,
            color: stockTakingData.Status.StatusFontColor,
            border: `1px solid ${stockTakingData.Status.StatusBorderColor}`,
            fontSize: `${stockTakingData.Status.StatusFontSize}px`,
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            display: 'inline-block'
          }">{{ stockTakingData.Status.StatusName }}</span>
        </div>
      </div>

      <div class="row invoice-cust-add mb-8">
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

      <div class="row invoice-body mb-8">
        <div class="col-xs-12 table-wrapper">
          <DataTable :value="stockTakingData.StockTakingItems" tableStyle="min-width: 50rem">
            <Column field="ItemCode" header="Item Code"></Column>
            <Column field="ItemName" header="Item Name"></Column>
            <Column field="LotNo" header="Lot/Serial No."></Column>
            <Column field="ExpiryDate" header="Expiry Date"></Column>
            <Column field="StockQuantity" header="Stock Quantity"></Column>
            <Column field="ActualQuantity" header="Actual Quantity"></Column>
            <Column field="DiffQuantity" header="Difference"></Column>
            <Column field="Unit" header="Unit"></Column>
            <Column field="Remark" header="Remark"></Column>
          </DataTable>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { StockTakingService } from '@/Service/stockTakingService'

import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const stockTakingData = ref();
const loading = ref(true);
const error = ref(null);
const route = useRoute();
const router = useRouter();

const breadcrumb = computed(() => {
  const breadcrumbItems: any[] = [];

  breadcrumbItems.push({ icon: 'pi pi-home', route: '/' });
  breadcrumbItems.push({ label: 'Stock Taking', url: '/StockTaking/List' });
  route.matched.forEach((matchedRoute) => {
    if (matchedRoute.meta.breadcrumb) {
      breadcrumbItems.push({
        label: matchedRoute.meta.breadcrumb,
        route: matchedRoute.path
      });
    }
  });

  return breadcrumbItems;
});

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
