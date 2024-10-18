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
                            dataKey="code" @change="handleWarehouseChange" />
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
                            placeholder="Select a Location" @filter="getLocationList(Number(selectWarehouse?.code))"
                            optionLabel="name" dataKey="code" @change="handleLocationChange"
                            :disabled="!selectWarehouse?.code" :showClear="true" />
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
                <DataTable :value="stockTakingItems" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
                  :scrollable="true" columnResizeMode="fit" :rowclass="rowClass" class="mb-10">
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
const takingId: number = Number(route.params.id);
const location = ref<SelectItem[]>([]);
const warehouse = ref<SelectItem[]>([]);
const personInCharge = ref<SelectItem[]>([]);

const fetchLoading = ref(false);

const selectWarehouse = ref<SelectItem | null>();
const selectLocation = ref<SelectItem | null>();
const selectPIC = ref<SelectItem | null>();

const stockTakingItems = ref<stockTakingItem[] | null>([]);
const stockTakingSave = ref<stockTakingHeaderSave>({
  takingId: takingId,
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
  subscription = warehouseService.getLocationByWarehouse(warehouseId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        location.value = CloneLocationDDL(result.data || [])
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
        if (stockTakingSave.value.personInCharge) {

          let selectedOption = personInCharge.value.find(item => item.name === stockTakingSave.value.personInCharge);

          let selectDDLPic: SelectItem = {
            name: stockTakingSave.value.personInCharge ? stockTakingSave.value.personInCharge : "-",
            code: String(selectedOption?.code)
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
  })
}

const getItems = async (warehouseId?: number, locationId: number | null = null) => {
  fetchLoading.value = true;
  subscription = stockTakingService.getStockItemForTaking(warehouseId, locationId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingItems.value = result.data;
        console.log('Items', stockTakingItems.value)
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

const handleWarehouseChange = (event: any) => {
  stockTakingItems.value = [];
  selectLocation.value = null;
  location.value = [];

  const warehouseId = Number(event.value.code);
  if (warehouseId) {
    getLocationList(warehouseId);
    getItems(warehouseId);
  }
};

const handleLocationChange = (event: any) => {
  const locationId = event.value ? Number(event.value.code) : null;
  if (selectWarehouse.value) {
    getItems(Number(selectWarehouse.value.code), locationId);
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
    code: option.locationID == 0 ? "0" : option.locationID,
  }));

  return data.length > 0 ? data : [];
}

const CloneUserDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.firstName == "" ? "--All--" : option.firstName + ' ' + option.lastName,
    code: option.userID == "" ? "0" : option.userID,
  }));
  return data.length > 0 ? data : [];
}

const fetchData = async () => {
  fetchLoading.value = true;
  subscription = StockTakingService.get(takingId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        stockTakingSave.value = result.data;

        if (stockTakingSave.value) {
          stockTakingItems.value = result.data.stockTakingItems;
          stockTakingSave.value.takingDate = new Date(stockTakingSave.value.takingDate)

          let selectDDLWarehouse: SelectItem = {
            code: result.data.warehouseId.toString(),
            name: result.data.warehouseName
          };
          selectWarehouse.value = selectDDLWarehouse ?? {} as SelectItem;
          if (stockTakingSave.value.warehouseId) {
            getLocationList(stockTakingSave.value.warehouseId);
            let selectDDLLocation: SelectItem = {
              code: result.data.locationId,
              name: result.data.locationName
            }
            selectLocation.value = selectDDLLocation;

            if (result.data.personInCharge) {
              getPIC('');
            }
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

const prepareDataForSave = () => {
  const dataToSave: stockTakingHeaderSave = {
    ...stockTakingSave.value,
    warehouseId: Number(selectWarehouse.value?.code) || 0,
    locationId: Number(selectLocation.value?.code) || 0,
    personInCharge: selectPIC.value?.code || '',
    stockTakingItems: stockTakingItems.value || []
  };
  return dataToSave;
};

const Save = async () => {
  const dataToSave = prepareDataForSave();

  fetchLoading.value = true;
  subscription = StockTakingService.save(dataToSave).subscribe({
    next: async (result) => {
      if (result.isSuccess) {
        const takingId = result.data;
        await router.push(`/StockTaking/Detail/${takingId}`)
        toast.add({ severity: 'success', summary: 'Saved', detail: 'Stock taking data saved successfully', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 3000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error saving data', detail: error, life: 3000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const Update = async () => {
  const dataToSave = prepareDataForSave();

  fetchLoading.value = true;
  subscription = StockTakingService.update(takingId, dataToSave).subscribe({
    next: async (result) => {
      if (result.isSuccess) {
        await router.push(`/StockTaking/Detail/${takingId}`)
        toast.add({ severity: 'success', summary: 'Saved', detail: 'Stock taking data saved successfully', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 3000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error saving data', detail: error, life: 3000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const SaveAndAdjust = async () => {
  const dataToSave = prepareDataForSave();

  fetchLoading.value = true;
  subscription = StockTakingService.saveAndAdjust(dataToSave).subscribe({
    next: async (result) => {
      if (result.isSuccess) {
        const takingId = result.data;
        await router.push(`/StockTaking/Detail/${takingId}`)
        toast.add({ severity: 'success', summary: 'Saved and Adjusted', detail: 'Stock taking data saved and adjusted successfully', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 3000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error saving and adjusting data', detail: error, life: 3000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const SavePlan = async () => {
  const dataToSave = prepareDataForSave();

  fetchLoading.value = true;
  subscription = StockTakingService.savePlan(dataToSave).subscribe({
    next: async (result) => {
      if (result.isSuccess) {
        const takingId = result.data;
        await router.push(`/StockTaking/Detail/${takingId}`)
        toast.add({ severity: 'success', summary: 'Plan Saved', detail: 'Stock taking plan saved successfully', life: 3000 });
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 3000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error saving plan', detail: error, life: 3000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

onUnmounted(() => {
  if (subscription)
    subscription.unsubscribe();

  setStickyButtons([]);
})

onMounted(() => {
  stockTakingSave.value.takingNo = "-- ออกโดยระบบ --";
  if (takingId != 0) {
    fetchData()
    getWarehouseList();
    getPIC('')
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
        if (takingId <= 0) {
          Save()
        } else {
          Update()
        }
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