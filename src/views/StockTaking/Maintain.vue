<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="card">
      <div class="page-content-inner">
        <div class="row">
          <div class="col-md-12">
            <div class="light bordered">
              <div class="portlet-title">
                <div class="caption">
                  <span class="caption-subject font-green bold uppercase">
                    {{ ('Add/Edit Stock Taking') }}
                  </span>
                </div>
              </div>
              <div class="portlet-body form">
                <div class="form-horizontal">
                  <div class="form-body">
                    <!-- Alert Message -->
                    <div v-if="error" class="alert alert-danger">
                      <button @click="hideError" type="button" class="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <span>{{ error }}</span>
                    </div>

                    <!-- Form Fields -->
                    <div class="form-fields">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4">{{ ('Taking No') }}</label>
                            <div class="col-sm-7">
                              <InputText v-model="formData.TakingNo" disabled class="form-control" readonly />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4 require">{{ ('Taking Date') }}</label>
                            <div class="col-sm-7">
                              <DatePicker v-model="formData.TakingDate" :format="dateFormat" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div></div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4 require">{{ ('Warehouse') }}</label>
                            <div class="col-sm-7">
                              <Select v-model="formData.WarehouseId" :options="warehouseList" filter optionLabel="name"
                                placeholder="Select a Warehouse" class="w-full md:w-56" @change="onWarehouseChange" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4">{{ ('Location') }}</label>
                            <div class="col-sm-7">
                              <Select v-model="formData.LocationId" :options="locationList" filter optionLabel="name"
                                placeholder="Select a Location" class="w-full md:w-56" @change="onLocationChange" />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4">{{ ('Person In Charge') }}</label>
                            <div class="col-sm-7">
                              <Select v-model="selectedCountry" :options="countries" filter optionLabel="name"
                                placeholder="Select a Person" class="w-full md:w-56" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Stock Items Table -->
                    <div class="row mb-8">
                      <div class="table-responsive">
                        <DataTable :value="formData.stockItems" editMode="cell"
                          @cell-edit-complete="onCellEditComplete">
                          <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"
                            style="min-width: 130px">
                            <template #editor="{ data, field }">
                              <Textarea type="text" v-if="field === 'Notes'" v-model="data.Notes" :disabled="false" />
                              <InputNumber type="number" v-else-if="field === 'ActualQuantity'"
                                v-model="data.ActualQuantity" />
                              <span v-else>{{ data[field] }}</span>
                            </template>
                          </Column>
                        </DataTable>
                      </div>
                    </div>
                    <!-- Remarks -->
                    <div class="control-label">
                      <label>{{ ('Remark') }}</label>
                      <Textarea v-model="formData.Remark" class="form-control"></Textarea>
                    </div>

                    <!-- Action Buttons -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{ 'layout-sidebar-open': !layoutState.staticMenuDesktopInactive, 'layout-sidebar-closed': layoutState.staticMenuDesktopInactive }">
      <div class="save-buttons">
        <Button severity="warn" @click="saveStockTaking('DRAFT')">{{ ('Save Draft') }}</Button>
        <Button @click="saveStockTaking('PLANNED')">{{
          ('Save Plan') }}</Button>
        <Button @click="saveStockTaking('APPROVED')">{{
          ('Save And Approve') }}</Button>
        <router-link :to="`/StockTaking/List`" custom v-slot="{ navigate }">
          <Button label="Cancel" severity="secondary" @click="navigate" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StockTakingService from '@/service/stockTakingService'
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import axios from 'axios'
import InputText from 'primevue/inputtext';
import { useLayout } from '@/layout/composables/layout';

interface Warehouse {
  id: number
  name: string
}

interface Location {
  id: number
  name: string
}

interface StockItem {
  TakingItemId: number;
  TakingId: number;
  CompanyId: number;
  ItemId: number;
  ItemCode: string;
  ItemName: string;
  ShelfCode: string | null;
  LotNo: string | null;
  ExpiryDate: string | null;
  UnitCost: number;
  StockQuantity: number;
  ActualQuantity: number;
  StockOnHand: number | null;
  DiffQuantity: number;
  Unit: string;
  Notes: string;
}

interface FormData {
  TakingNo: string;
  TakingDate: Date;
  WarehouseId: number | null;
  LocationId: number | null;
  Remark: string;
  stockItems: StockItem[];
}

const columns = ref([
  { field: 'ItemCode', header: 'Item Code' },
  { field: 'ItemName', header: 'Item Name' },
  { field: 'LotNo', header: 'Lot/Serial No.' },
  { field: 'ExpiryDate', header: 'Expiry Date' },
  { field: 'StockQuantity', header: 'Stock Quantity' },
  { field: 'ActualQuantity', header: 'Actual Quantity' },
  { field: 'DiffQuantity', header: 'Adjust Quantity' },
  { field: 'Unit', header: 'Unit' },
  { field: 'Notes', header: 'Notes' }
]);

// Initialize formData as reactive
const formData = reactive<FormData>({
  TakingNo: '',
  TakingDate: new Date(),
  WarehouseId: null,
  LocationId: null,
  Remark: '',
  stockItems: []
});

const selectedCountry = ref();
const countries = ref([ /* your country data */]);

const route = useRoute();
const warehouseList = ref<Warehouse[]>([]);
const locationList = ref<Location[]>([]);
const dateFormat = 'dd/MM/yyyy';
const hasApprovePermission = ref(false);
const error = ref();
const loading = ref(true);
const TakingId: number = Number(route.params.id);
const { layoutState } = useLayout();

const fetchInitialData = async () => {
  try {
    const response = await StockTakingService.get(TakingId);
    if (response.Code === 200 && response.Data) {
      formData.TakingNo = response.Data.TakingNo;
      formData.TakingDate = new Date(response.Data.TakingDate);
      formData.WarehouseId = response.Data.WarehouseId;
      formData.LocationId = response.Data.LocationId;
      formData.Remark = response.Data.Remark;
      formData.stockItems = response.Data.StockTakingItems;
    } else {
      error.value = response.Message || 'Error fetching data';
    }
  } catch (err) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const onWarehouseChange = async () => {
  try {
    const response = await axios.get(`/api/stock-taking/locations/${formData.WarehouseId}`);
    locationList.value = response.data.locationList;
    formData.LocationId = null; // Reset LocationId
    await fetchStockItems();
  } catch (err) {
    console.error('Failed to fetch locations: ', err);
    error.value = 'Failed to fetch locations';
  }
};

const onLocationChange = async () => {
  await fetchStockItems();
};

const fetchStockItems = async () => {
  try {
    const response = await axios.get('/api/stock-taking/stock-items', {
      params: {
        warehouseId: formData.WarehouseId,
        locationId: formData.LocationId
      }
    });
    formData.stockItems = response.data.stockItems.map((item: StockItem) => ({
      ...item,
      DiffQuantity: 0 // Initialize DiffQuantity
    }));
  } catch (err) {
    console.error('Failed to fetch stock items: ', err);
    error.value = 'Failed to fetch stock items';
  }
};

const onCellEditComplete = (event) => {
  let { data, newValue, field } = event;
  if (field === 'DiffQuantity' && !isPositiveInteger(newValue)) {
    event.preventDefault();
  } else {
    data[field] = newValue;
  }
};

const isPositiveInteger = (val) => {
  let str = String(val).trim();
  return str !== '' && /^\d+$/.test(str);
};

const saveStockTaking = async (status: 'DRAFT' | 'PLANNED' | 'APPROVED') => {
  try {
    await StockTakingService.save({ ...formData, status });
    // Add success message and redirect logic here
  } catch (err) {
    error.value = 'Failed to save stock taking';
  }
};

const cancel = () => {
  // Logic to navigate back or clear the form
};

onMounted(fetchInitialData);
</script>

<style scoped>
/* Add your styles here */
</style>
