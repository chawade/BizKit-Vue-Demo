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
                            dataKey="code" 
                            @change="handleWarehouseChange(Number(selectWarehouse?.code), Number(selectLocation?.code))" />
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
                          <SelectCustom v-model="selectLocation" :options="location" :loading="fetchLoading"
                            placeholder="Select a Location" optionLabel="name" dataKey="code" 
                            @change="handleWarehouseChange(Number(selectWarehouse?.code), Number(selectLocation?.code))" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Person
                          In Charge</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPIC" :options="personInCharge" :loading="fetchLoading"
                            placeholder="Select a Person" @filter="getPIC" optionLabel="name" dataKey="code" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DataTable 
                  :value="stockTakingItems" 
                  scrollable scrollHeight="400px" 
                  tableStyle="min-width: 50rem"
                  :scrollable="true" 
                  columnResizeMode="fit" 
                  :rowclass="rowClass" 
                  class="mb-10">
                  <!-- LineNumber -->
                  <Column field="lineNumber" header="No.">
                    <template #body="{ index }">
                      {{ index + 1 }}
                    </template>
                  </Column>

                  <!-- Item Code Column -->
                  <Column field="itemCode" header="Item Code" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.itemCode }}
                    </template>
                  </Column>

                  <!-- Item Name Column -->
                  <Column field="itemName" header="Item Name" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.itemName }}
                    </template>
                  </Column>

                  <!-- Shelf Code Column -->
                  <Column field="shelfCode" header="Shelf Name" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.shelfCode ?? '' }}
                    </template>
                  </Column>

                  <!-- Lot No Column -->
                  <Column field="lotNo" header="Lot/Serial No." class="min-w-40">
                    <template #body="{ data }">
                      {{ data.lotNo ?? '' }}
                    </template>
                  </Column>

                  <!-- Expiry Date Column -->
                  <Column field="expiryDate" header="Expiry Date" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.expiryDate ? new Date(data.expiryDate).toLocaleDateString() : ' ' }}
                    </template>
                  </Column>

                  <!-- Stock Quantity Column -->
                  <Column field="stockQuantity" header="Stock Qty" class="min-w-40">
                    <template #body="{ data }">
                      {{ data.stockOnHand ?? 0 }}
                    </template>
                  </Column>

                  <!-- Actual Quantity Column (Editable) -->
                  <Column field="actualQuantity" header="Actual Qty" class="min-w-40">
                    <template #body="{ data, index }">
                      <InputNumber v-model="data.actualQuantity" class="min-w-30" @focus="onFieldFocus(index)"
                        @blur="onFieldBlur" :key="`actualQuantity-${index}`" />
                    </template>
                  </Column>

                  <!-- Adjust Quantity Column -->
                  <Column field="diffQuantity" header="Adjust Qty" class="min-w-40">
                    <template #body="{ data }">
                      {{ (data.actualQuantity - (data.stockOnHand ?? 0)).toFixed(2) }}
                    </template>
                  </Column>

                  <!-- Unit Column -->
                  <Column field="unit" header="Unit" class="min-w-10">
                    <template #body="{ data }">
                      {{ data.unit }}
                    </template>
                  </Column>

                  <!-- Notes Column (Editable) -->
                  <Column field="notes" header="Notes" class="min-w-40">
                    <template #body="{ data, index }">
                      <Textarea v-model="data.notes" rows="2" cols="30" :key="`notes-${index}`" />
                    </template>
                  </Column>

                </DataTable>
                <div class="grid grid-col-12 gap-2">
                  <label for="Remark"
                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Remark</label>
                  <div class="col-span-12 md:col-span-8">
                    <Textarea v-model="stockTakingSave.remark" rows="2" cols="30" :key="`notes`" />
                  </div>
                </div>
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
import type { stockTakingHeaderSave, stockTakingItem } from '@/Model/stockTaking';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import SelectCustom from '@/components/SelectCustom.vue';
import StockTakingService from '@/service/stockTakingService';
import warehouseService from '@/service/warehouseService';
import userService from '@/service/userService';
import type { SelectItem } from '@/Model/BaseResource';
import router from '@/router';
import stockTakingService from '@/service/stockTakingService';

let subscription: Subscription;
const setStickyButtons = inject<any>('setStickyButtons');

const toast = useToast();
const loading = ref(false);
const error = ref('');

const route = useRoute();
const TakingId: number = Number(route.params.id);
const location = ref<SelectItem[]>([]);
const warehouse = ref<SelectItem[]>([]);
const personInCharge = ref<SelectItem[]>([]);

const fetchLoading = ref(false);

const selectWarehouse = ref<SelectItem | null>();
const selectLocation = ref<SelectItem | null>();
const selectPIC = ref<SelectItem | null>();

const stockTakingItems = ref<stockTakingItem[] | null>([]);
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

const getLocationList = async (warehouseId: number) => {
  fetchLoading.value = true;
  selectLocation.value = null;
  subscription = warehouseService.getLocationByWarehouse(warehouseId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        location.value = CloneLocationDDL(result.data || []);
        console.log('location',location.value)
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

const getPIC = async (name: string) => {
  fetchLoading.value = true;
  subscription = userService.getUserList(name).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        personInCharge.value = CloneUserDDL(result.data || []);
        console.log('personInCharge: ', personInCharge.value);
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
  })
}

const getItems = async (warehouseId?: number, locationId?: number) => {
  fetchLoading.value = true;
  subscription = stockTakingService.getStockItemForTaking(warehouseId, locationId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingItems.value = result.data;
        console.log('Items',stockTakingItems.value)
      } else {
        stockTakingItems.value = null;
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

const handleWarehouseChange = (warehouseId: number, locationId: number) => {
  selectLocation.value = null;

  if (warehouseId) {
    getLocationList(warehouseId);
    getItems(warehouseId, undefined);
  } else {
    console.error("Invalid warehouseId");
  }
  
  if (locationId) {
    getItems(warehouseId, locationId);
  } else {
    console.error("Invalid locationId");
  }
};

const CloneWarehouseDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.warehouseName == "" ? "--All--" : option.warehouseName,
    code: option.warehouseID == 0 ? "0" : option.warehouseId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneLocationDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.locationName == "" ? "--All--" : option.locationName,
    code: option.locationId == 0 ? "0" : option.locationId,
  }));

  return data.length > 0 ? data : [];
}

const CloneUserDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.FirstName == "" ? "--All--" : option.FirstName + ' ' + option.LastName,
    code: option.Email == "" ? "0" : option.Email,
  }));

  return data.length > 0 ? data : [];
}


const fetchData = async () => {
  fetchLoading.value = true;
  subscription = StockTakingService.get(TakingId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingSave.value = result.data;

        if (stockTakingSave.value) {
          stockTakingItems.value = result.data.stockTakingItems;
          stockTakingSave.value.takingDate = new Date(stockTakingSave.value.takingDate)

          getWarehouseList();
          let selectDDLWarehouse: SelectItem = {
            code: stockTakingSave.value.warehouseId.toString(),
            name: result.data.warehouseName
          };
          selectWarehouse.value = selectDDLWarehouse ?? {} as SelectItem;

          getLocationList(stockTakingSave.value.warehouseId);
        debugger;
          let selectDDLLocation: SelectItem = {
            code: (stockTakingSave.value.locationId ?? 0).toString(),
            name: result.data.locationName
          };
          selectLocation.value = selectDDLLocation ?? {} as SelectItem;

          getPIC('');
          let selectDDLPic: SelectItem = {
            code: stockTakingSave.value.personInCharge,
            name: result.data.personInCharge
          };
          selectPIC.value = selectDDLPic ?? {} as SelectItem;
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

const Save = () => {
  console.log('save');
}

const SaveAndAdjust = () => {
  console.log('save approve');
}

const SavePlan = () => {
  console.log('save plan');
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
  } else {
    getWarehouseList()
    getPIC('')
  }

  setStickyButtons([
    {
      icon: 'pi pi-cog',
      label: 'Save',
      severity: 'info',
      action: () => {
        Save()
      }
    },
    {
      icon: 'pi pi-check',
      label: 'Save And Adjust',
      severity: 'info',
      action: () => { 
        SaveAndAdjust()
       }
    },
    {
      icon: 'pi pi-check',
      label: 'Save Plan',
      severity: 'success',
      action: () => { 
        SavePlan()
       }
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