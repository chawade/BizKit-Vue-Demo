<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div class="card">
        <div class="page-content-inner">
          <div class="row">
            <div class="col-md-12">
              <div class=" light bordered">
                <!-- portlet -->
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
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4">{{ ('Taking No') }}</label>
                            <div class="col-sm-7">
                              <input v-model="formData.takingNo" class="form-control" readonly />
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4 require">{{ ('Taking Date') }}</label>
                            <div class="col-sm-7">
                              <DatePicker v-model="formData.takingDate" :format="dateFormat" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4 require">{{ ('Warehouse') }}</label>
                            <div class="col-sm-7">
                              <Select v-model="formData.warehouseId" class="form-control" @change="onWarehouseChange">
                                <option v-for="warehouse in warehouseList" :key="warehouse.id" :value="warehouse.id">
                                  {{ warehouse.name }}
                                </option>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label class="control-label col-sm-4">{{ ('Location') }}</label>
                            <div class="col-sm-7">
                              <Select v-model="formData.locationId" class="form-control" @change="onLocationChange">
                                <option v-for="location in locationList" :key="location.id" :value="location.id">
                                  {{ location.name }}
                                </option>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Stock Items Table -->
                      <div class="row">
                        <div class="table-responsive">
                          <DataTable :value="formData" tableStyle="min-width: 50rem">
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

                      <!-- Remarks -->
                      <div class="row">
                        <div class="col-sm-5">
                          <label class="control-label">{{ ('stockTaking.remark') }}</label>
                          <textarea v-model="formData.remark" class="form-control" rows="8"></textarea>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="row">
                        <div class="col-sm-12 text-right savebuttons">
                          <button @click="saveStockTaking('DRAFT')" class="bz-btn btn-warning">{{ ('stockTaking.save')
                            }}</button>
                          <button @click="saveStockTaking('PLANNED')" class="bz-btn btn-success">{{
                            ('stockTaking.savePlan') }}</button>
                          <button v-if="hasApprovePermission" @click="saveStockTaking('APPROVED')"
                            class="bz-btn blue">{{
                              ('stockTaking.saveAndApprove') }}</button>
                          <button @click="cancel" class="bz-btn grey">{{ ('stockTaking.cancel') }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
// import { useI18n } from 'vue-i18n'
import axios from 'axios'
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

interface Warehouse {
  id: number
  name: string
}

interface Location {
  id: number
  name: string
}

interface StockItem {
  itemCode: string
  itemName: string
  shelfCode: string
  lotNo: string
  expiryDate: string
  onHandQty: number
  actualQty: number
  difference: number
  uom: string
  notes: string
}

interface FormData {
  takingNo: string
  takingDate: Date
  warehouseId: number | null
  locationId: number | null
  remark: string
  stockItems: StockItem[]
}

const error = ref<boolean | null>(null)
const formData = reactive<FormData>({
  takingNo: '',
  takingDate: new Date(),
  warehouseId: null,
  locationId: null,
  remark: '',
  stockItems: []
})

const warehouseList = ref<Warehouse[]>([])
const locationList = ref<Location[]>([])
const dateFormat = 'dd/MM/yyyy'
const qtyDecimalPlaces = 2
const hasApprovePermission = ref(false)
const title = ref<string>('');

const fetchInitialData = async () => {
  try {
    const response = await axios.get('/api/stock-taking/initial-data')
    warehouseList.value = response.data.warehouseList
    hasApprovePermission.value = response.data.hasApprovePermission
    // Set other initial data as needed
  } catch (err) {
    error.value = 'Failed to fetch initial data'
  }
}

const onWarehouseChange = async () => {
  try {
    const response = await axios.get(`/api/stock-taking/locations/${formData.warehouseId}`)
    locationList.value = response.data.locationList
    formData.locationId = null
    await fetchStockItems()
  } catch (err) {
    error.value = 'Failed to fetch locations'
  }
}

const onLocationChange = async () => {
  await fetchStockItems()
}

const fetchStockItems = async () => {
  try {
    const response = await axios.get('/api/stock-taking/stock-items', {
      params: {
        warehouseId: formData.warehouseId,
        locationId: formData.locationId
      }
    })
    formData.stockItems = response.data.stockItems.map((item: StockItem) => ({
      ...item,
      actualQty: item.onHandQty,
      difference: 0
    }))
  } catch (err) {
    error.value = 'Failed to fetch stock items'
  }
}

const updateDifference = (index: number) => {
  const item = formData.stockItems[index]
  item.difference = item.actualQty - item.onHandQty
}

const formatNumber = (value: number): string => {
  return value.toFixed(qtyDecimalPlaces)
}

const saveStockTaking = async (status: 'DRAFT' | 'PLANNED' | 'APPROVED') => {
  try {
    const response = await axios.post('/api/stock-taking/save', {
      ...formData,
      status
    })
    // Handle successful save
    console.log('Stock taking saved:', response.data)
  } catch (err) {
    error.value = 'Failed to save stock taking'
  }
}

const cancel = () => {
  // Implement cancel logic (e.g., redirect to list page)
}

const hideError = () => {
  error.value = null
}

onMounted(fetchInitialData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>