<template>
  <div v-if="loading" class="justify-center"
    style="width: 100%; height: 100%; text-align: center; vertical-align: middle;">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="flex flex-col gap-x-20 lg:flex-row w-full">
      <!-- Left Card -->
      <div class="flex flex-col w-full">
        <Card class="w-full">
          <template #title>
            <div class="portlet-title">
              <div class="caption">
                <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">Stock Taking</span>
              </div>
            </div>
          </template>
          <template #content>
            <form @submit.prevent="">
              <Fluid>
                <div class="flex flex-col md:flex-row">
                  <div class="md:w-2/4">
                    <div class="card flex flex-col gap-4">
                      <div class="grid grid-cols-12 gap-2">
                        <label for="SONo"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Taking
                          No.</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputGroup>
                            <InputText v-model="stockTakingSave.takingNo" variant="filled" readonly="true" />
                            <Button icon="pi pi-cog" severity="help" @click="" />
                          </InputGroup>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Warehouse"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Warehouse</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectWarehouse" :options="warehouse" :loading="fetchLoading"
                            placeholder="Select a Warehouse" @filter="getWarehouseList" optionLabel="name"
                            dataKey="code" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="md:w-2/4">
                    <div class="card flex flex-col gap-4">
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Plan Ship Date"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Taking
                          Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="stockTakingSave.takingDate" variant="filled" showButtonBar showIcon fluid
                            :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Location"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Location</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectLocation" :options="filteredLocations" :loading="fetchLoading"
                            placeholder="Select a Location" optionLabel="name" dataKey="code" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Person
                          In Charge</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectUser" :options="user" :loading="fetchLoading"
                            placeholder="Select a Person" @filter="getUserList" optionLabel="name" dataKey="code" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DataTable :value="stockTakingItems" tableStyle="min-width: 50rem" :scrollable="true"
                  columnResizeMode="fit" :rowclass="rowClass">
                  <!-- LineNumber -->
                  <!-- <Column field="LineNumber" header="No.">
                    <template #body="{ index }">
                      {{ index + 1 }}
                    </template>
</Column> -->

                  <!-- Item Code Column -->
                  <Column field="ItemCode" header="Item Code" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.itemCode }}
                    </template>
                  </Column>

                  <!-- Item Name Column -->
                  <Column field="ItemName" header="Item Name" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.itemName }}
                    </template>
                  </Column>

                  <!-- Shelf Code Column -->
                  <Column field="ShelfCode" header="Shelf Name" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.shelfCode ?? '' }}
                    </template>
                  </Column>

                  <!-- Lot No Column -->
                  <Column field="LotNo" header="Lot/Serial No." class="min-w-40">
                    <template #body="{ data }">
                      {{ data.lotNo ?? '' }}
                    </template>
                  </Column>

                  <!-- Expiry Date Column -->
                  <Column field="ExpiryDate" header="Expiry Date" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : ' ' }}
                    </template>
                  </Column>

                  <!-- Stock Quantity Column -->
                  <Column field="StockQuantity" header="Stock Qty" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.stockQuantity }}
                    </template>
                  </Column>

                  <!-- Actual Quantity Column (Editable) -->
                  <Column field="ActualQuantity" header="Actual Qty" class="min-w-40">
                    <template #body="{ data, index }">
                      <InputNumber v-model="data.actualQuantity" class="min-w-30" @focus="onFieldFocus(index)"
                        @blur="onFieldBlur" :key="`actualQuantity-${index}`" />
                    </template>
                  </Column>

                  <!-- Adjust Quantity Column -->
                  <Column field="ActualQuantity" header="Adjust Qty" class="min-w-40">
                    <template #body="{ data }">
                      {{ (data.actualQuantity - data.stockOnHand).toFixed(2) }}
                    </template>
                  </Column>

                  <!-- Unit Column -->
                  <Column field="Unit" header="Unit" class="min-w-10">
                    <template #body="{ data }">
                      {{ data.unit }}
                    </template>
                  </Column>

                  <!-- Notes Column (Editable) -->
                  <Column field="Notes" header="Notes" class="min-w-40">
                    <template #body="{ data, index }">
                      <Textarea v-model="data.notes" rows="2" cols="30" :key="`notes-${index}`" />
                    </template>
                  </Column>

                </DataTable>
              </Fluid>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive, onUnmounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StockTakingService from '@/service/stockTakingService';
import type { stockTakingHeaderSave, stockTakingItem } from '@/Model/StockTaking';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import SelectCustom from '@/components/SelectCustom.vue';
import PriceList from '@/Model/GlobalVariable/PriceList'
import warehouseService from '@/service/warehouseService';
import type { SelectItem } from '@/Model/BaseResource';
import router from '@/router';

let subscription: Subscription;
const setStickyButtons = inject<any>('setStickyButtons');

const toast = useToast();
const loading = ref(false);
const error = ref('');
const SkipPick = ref(false);
const ddlPrice = new PriceList().getPriceList();
const currentPage = ref(1)
const totalPages = ref(0)
const pageSize = ref(20)
const searchString = ref('')
const sortKey = ref('CustomerName')
const sortOrder = ref('DESC')
const totalRecords = ref(0)

const route = useRoute();
const TakingId: number = Number(route.params.id);
const location = ref<SelectItem[]>([]);
const warehouse = ref<SelectItem[]>([]);
const personInCharge = ref<SelectItem[]>([]);

const fetchLoading = ref(false);

const selectCustomer = ref<SelectItem | null>();
const selectPaymentTerm = ref<SelectItem | null>();
const selectWarehouse = ref<SelectItem | null>();
const selectLocation = ref<SelectItem | null>();

const stockTakingItems = ref<stockTakingItem[]>([]);
const stockTakingSave = ref<stockTakingHeaderSave>({
  takingId: 0,
  takingNo: '',
  takingDate: new Date(),
  warehouseId: 0,
  locationId: 0,
  personInCharge: '',
  statusCode: 100,
  remark: '',
  stockTakingItems: []
});

const focusedRowIndex = ref<number | null>(null);
const onFieldFocus = (index: number) => {
  focusedRowIndex.value = index;
};

const onFieldBlur = () => {
  focusedRowIndex.value = null;
};

const rowClass = (data: stockTakingItem, index: number) => {
  return {
    'focused-row': focusedRowIndex.value === index
  };
};

const getWarehouseList = async () => {
  fetchLoading.value = true;
  subscription = warehouseService.getWarehouseList().subscribe({
    next: (result) => {
      if (result.isSuccess) {
        warehouse.value = CloneWarehouseDDL(result.data || []);
        console.log('warehouse: ', warehouse.value);
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const getLocationList = async () => {
  debugger;
  fetchLoading.value = true;
  subscription = warehouseService.getLocationList().subscribe({
    next: (result) => {
      if (result.isSuccess) {
        location.value = CloneLocationDDL(result.data || []);
        console.log('location: ', location.value);
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const filteredLocations = computed(() => {
  if (selectWarehouse.value) {
    return location.value.filter(loc => loc.warehouseId === selectWarehouse.value?.code);
  }
  return location.value;
});

const fetchData = async () => {
  fetchLoading.value = true;
  subscription = StockTakingService.get(TakingId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingSave.value = result.data;
        debugger;

        if (stockTakingSave.value) {
          stockTakingItems.value = result.data.stockTakingItems;
          stockTakingSave.value.takingDate = new Date(stockTakingSave.value.takingDate)
          const warehouse = stockTakingSave.value.warehouseId
          const location = stockTakingSave.value.locationId
          const personInCharge = stockTakingSave.value.personInCharge

          if (warehouse) {
            getWarehouseList();
            let selectDDL: SelectItem = {
              code: warehouse.toString(),
              name: result.data.WarehouseName
            };
            selectWarehouse.value = selectDDL ?? {} as SelectItem;
          }

          if (location) {
            getLocationList();
            let selectDDL: SelectItem = {
              code: location.toString(),
              name: result.data.LocationName
            };
            selectLocation.value = selectDDL ?? {} as SelectItem;
          }
          
          if (personInCharge) {
            getLocationList();
            let selectDDL: SelectItem = {
              code: personInCharge,
              name: personInCharge
            };
            selectLocation.value = selectDDL ?? {} as SelectItem;
          }

        }

      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const CloneWarehouseDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.WarehouseName == "" ? "--All--" : option.WarehouseName,
    code: option.WarehouseID == 0 ? "0" : option.WarehouseId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneLocationDDL = (options: Array<any>): Array<SelectItem> => {
  debugger;
  const data = options.map((option) => ({
    name: option.LocationName == "" ? "--All--" : option.LocationName,
    code: option.LocationId == 0 ? "0" : option.LocationId,
    warehouseId: option.WarehouseId
  }));

  return data.length > 0 ? data : [];
}

const SaveStockTaking = () => {
  console.log('save');
}

onUnmounted(() => {
  if (subscription)
    subscription.unsubscribe();

  setStickyButtons([]);

})

onMounted(() => {
  stockTakingSave.value.takingNo = "-- ออกโดยระบบ --";
  if (TakingId != 0) {
    fetchData()
    console.log('Stock Taking: ', stockTakingSave.value);
  }

  setStickyButtons([
    {
      icon: 'pi pi-cog',
      label: 'Save',
      severity: 'info',
      action: () => {
        SaveStockTaking()
      }
    },
    {
      icon: 'pi pi-check',
      label: 'Save And Approve',
      severity: 'info',
      action: () => { /* Save and approve logic */ }
    },
    {
      icon: 'pi pi-times',
      label: 'Cancel',
      severity: 'secondary',
      action: async () => {
        await router.push({ name: 'StockTaking' })
      }
    }
  ]);

})
</script>