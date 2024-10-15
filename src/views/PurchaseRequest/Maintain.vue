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
                <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">Purchase Request</span>
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
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">PR
                          No.</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputGroup>
                            <InputText v-model="purchaseRequestSave.PurchaseRequestNo" variant="filled"
                              readonly="true" />
                            <Button icon="pi pi-cog" severity="help" @click="" />
                          </InputGroup>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Plan Ship Date"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Vendor</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPaymentTerm" :options="ddlPaymentTerm" :loading="fetchLoading"
                            placeholder="Select a Vendor" @filter="getPaymentTermList" optionLabel="name"
                            dataKey="code" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Payment Term"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Lead
                          Time (Day)</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputText id="name3" type="text" disabled placeholder="" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">PIC</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectWarehouse" :options="ddlWarehouse" :loading="fetchLoading"
                            placeholder="Select a PIC" @filter="getWarehouseList" optionLabel="name" dataKey="code" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Shipping
                          Address</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectWarehouse" :options="ddlWarehouse" :loading="fetchLoading"
                            placeholder="Select a Address" @filter="getWarehouseList" optionLabel="name"
                            dataKey="code" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="md:w-2/4">
                    <div class="card flex flex-col gap-4">
                      <div class="grid grid-cols-12 gap-2">
                        <label for="SODate"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Issue
                          Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="purchaseRequestSave.DueDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="referenceNo"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Reference
                          No.</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputText id="name3" type="text" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Due Date"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Require
                          Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="purchaseRequestSave.DeliveryDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Project</label>
                        <div class="col-span-12 md:col-span-8">
                          <Select v-model="purchaseRequestSave.Project" placeholder="Select a Project"
                            :options="ddlPrice" optionLabel="name" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Department</label>
                        <div class="col-span-12 md:col-span-8">
                          <Select v-model="purchaseRequestSave.Department" placeholder="Select a Project"
                            :options="ddlPrice" optionLabel="name" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Detail -->
                <div class="card">
                  <Suspense>
                    <TabPanel :lazy="true" value="1" header="Order">
                      <div class="row invoice-body mb-8">
                        <div class="col-xs-12 table-wrapper">
                          <ContextMenu ref="cm" :model="menuModel" @hide="selectedProduct = null" />

                          <DataTable :value="purchaseRequestItem" tableStyle="min-width: 50rem" contextMenu
                            v-model:contextMenuSelection="selectedProduct" :scrollable="true" columnResizeMode="fit"
                            @rowContextmenu="onRowContextMenu" :rowclass="rowClass"
                            class="mb-8">

                            <template #header>
                              <Menubar class="hidden md:flex">
                                <template #end>
                                  <Button type="button" icon="pi pi-plus-circle" label="Add" raised @click="addRow" />
                                </template>
                              </Menubar>
                            </template>

                            <!-- LineNumber -->
                            <Column field="LineNumber" header="No.">
                              <template #body="{ data, index }">
                                {{ index + 1 }}
                              </template>
                            </Column>

                            <!-- Item Code Column with unique key -->
                            <Column field="selectItem" header="Item Code" class="min-w-60">
                              <template #body="{ data, index }">
                                <SelectCustom v-model="data.selectItem" :options="data.DDLItem" :loading="fetchLoading"
                                  placeholder="Select an item" @filter="(event) => getItemList(event, index)"
                                  optionLabel="name" dataKey="code" :key="`code-${index}`"> <!-- key added here -->

                                  <template #option="slotProps">
                                    <Card class="w-[400px] min-w-56">
                                      <template #title>
                                        <div class="caption">
                                          <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">
                                            <i class="pi pi-credit-card"></i> Item Code : {{ slotProps.option.name }}
                                          </span>
                                        </div>
                                      </template>
                                      <template #content>
                                        <div class="text-start">
                                          <div><i class="pi pi-barcode text-primary" aria-hidden="true"></i><b> Item
                                              Name :</b>
                                            TestMultiImport3
                                          </div>
                                          <div><i class="pi pi-user text-primary" aria-hidden="true"></i><b> Customer
                                              Item Code :</b>
                                            ABCDE
                                          </div>
                                          <div><i class="pi pi-info text-primary" aria-hidden="true"></i><b> Available
                                              Qty(All) :</b>
                                            1,473.00
                                          </div>
                                        </div>
                                      </template>
                                    </Card>
                                  </template>
                                </SelectCustom>
                              </template>
                            </Column>

                            <!-- Item Name Column with unique key -->
                            <Column field="itemName" header="Item Name" class="min-w-60">
                              <template #body="{ data, index }">
                                <Textarea v-model="data.itemName" rows="2" cols="30" :key="`itemName-${index}`" />
                                <!-- key added here -->
                              </template>
                            </Column>

                            <Column field="RequiredDate" header="Required Date" class="min-w-60">
                              <template #body="{ data, index }">
                                <Textarea v-model="data.itemName" rows="2" cols="30" :key="`RequiredDate-${index}`" />
                                <!-- key added here -->
                              </template>
                            </Column>

                            <!-- Order Qty Column with unique key -->
                            <Column field="OrderQty" header="Order Qty" class="w-40">
                              <template #body="{ data, index }">
                                <InputNumber v-model="data.OrderQty" class="min-w-36" @focus="onFieldFocus(index)"
                                  @blur="onFieldBlur" :key="`orderQty-${index}`" /> <!-- key added here -->
                              </template>
                            </Column>

                            <Column field="selectItem" header="UOM" class="min-w-60">
                              <template #body="{ data, index }">
                                <SelectCustom v-model="data.selectItem" :options="data.DDLItem" :loading="fetchLoading"
                                  placeholder="Select an item" @filter="(event) => getItemList(event, index)"
                                  optionLabel="name" dataKey="code" :key="`code-${index}`"> <!-- key added here -->

                                  <template #option="slotProps">
                                    <Card class="w-[400px] min-w-56">
                                      <template #title>
                                        <div class="caption">
                                          <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">
                                            <i class="pi pi-credit-card"></i> UOM : {{ slotProps.option.name }}
                                          </span>
                                        </div>
                                      </template>
                                      <template #content>
                                        <div class="text-start">
                                          <div><i class="pi pi-barcode text-primary" aria-hidden="true"></i><b> Item
                                              Name :</b>
                                            TestMultiImport3
                                          </div>
                                          <div><i class="pi pi-user text-primary" aria-hidden="true"></i><b> Customer
                                              Item Code :</b>
                                            ABCDE
                                          </div>
                                          <div><i class="pi pi-info text-primary" aria-hidden="true"></i><b> Available
                                              Qty(All) :</b>
                                            1,473.00
                                          </div>
                                        </div>
                                      </template>
                                    </Card>
                                  </template>
                                </SelectCustom>
                              </template>
                            </Column>
                            <!-- Unit Price Column with unique key -->
                            <Column field="UnitCost" header="Unit Cost">
                              <template #body="{ data, index }">
                                <InputNumber v-model="data.UnitPrice" class="min-w-36" mode="currency" currency="THB"
                                  @focus="onFieldFocus(index)" @blur="onFieldBlur" :key="`unitPrice-${index}`" />
                                <!-- key added here -->
                              </template>
                            </Column>

                            <Column field="selectItem" header="VAT" class="min-w-60">
                              <template #body="{ data, index }">
                                <SelectCustom v-model="data.selectItem" :options="data.DDLItem" :loading="fetchLoading"
                                  placeholder="Select an item" @filter="(event) => getItemList(event, index)"
                                  optionLabel="name" dataKey="code" :key="`code-${index}`"> <!-- key added here -->

                                  <template #option="slotProps">
                                    <Card class="w-[400px] min-w-56">
                                      <template #title>
                                        <div class="caption">
                                          <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">
                                            <i class="pi pi-credit-card"></i> UOM : {{ slotProps.option.name }}
                                          </span>
                                        </div>
                                      </template>
                                      <template #content>
                                        <div class="text-start">
                                          <div><i class="pi pi-barcode text-primary" aria-hidden="true"></i><b> Item
                                              Name :</b>
                                            TestMultiImport3
                                          </div>
                                          <div><i class="pi pi-user text-primary" aria-hidden="true"></i><b> Customer
                                              Item Code :</b>
                                            ABCDE
                                          </div>
                                          <div><i class="pi pi-info text-primary" aria-hidden="true"></i><b> Available
                                              Qty(All) :</b>
                                            1,473.00
                                          </div>
                                        </div>
                                      </template>
                                    </Card>
                                  </template>
                                </SelectCustom>
                              </template>
                            </Column>

                            <Column field="Totol" header="Unit Cost">
                              <template #body="{ data, index }">
                                <InputNumber v-model="data.UnitPrice" class="min-w-36" mode="currency" currency="THB"
                                  @focus="onFieldFocus(index)" @blur="onFieldBlur" :key="`unitPrice-${index}`" />
                                <!-- key added here -->
                              </template>
                            </Column>
                          </DataTable>  
                          <div class="flex flex-col md:flex-row w-full gap-6">
                            <div class="w-full md:w-1/2">
                              <Label htmlFor="remark" class="text-lg font-semibold mb-2">Remark</Label>
                              <Textarea id="remark" class="w-full h-40" v-model="remark" />
                            </div>
                            <div class="w-full md:w-1/2">
                              <div class="space-y-4">
                                <div class="grid grid-cols-12 gap-4">
                                  <Label
                                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Subtotal</Label>
                                  <div class="col-span-12 md:col-span-8 w-full">
                                    <InputText type="text" :value="subtotal.toFixed(2)" class="w-full text-right h-10"
                                      readOnly />
                                  </div>
                                </div>
                                <div class="grid grid-cols-12 gap-4">
                                  <Label
                                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">VAT</Label>
                                  <div class="col-span-12 md:col-span-8 w-full">
                                    <InputText type="text" :value="vat.toFixed(2)" class="w-full text-right h-10"
                                      readOnly />
                                  </div>
                                </div>
                                <div class="grid grid-cols-12 gap-4">
                                  <Label
                                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Other
                                    Charges</Label>
                                  <div class="col-span-12 md:col-span-8 w-full">
                                    <InputNumber type="number" v-model.number="otherCharges"
                                      class="w-full text-right h-10" />
                                  </div>
                                </div>
                                <div class="grid grid-cols-12 gap-4">
                                  <Label
                                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Adjustment</Label>
                                  <div class="col-span-12 md:col-span-8 w-full">
                                    <InputNumber type="number" v-model.number="adjustment"
                                      class="w-full text-right h-10" />
                                  </div>
                                </div>
                                <div class="grid grid-cols-12 gap-4 font-semibold">
                                  <Label
                                    class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Grand
                                    Total</Label>
                                  <div class="col-span-12 md:col-span-8 w-full">
                                    <InputText type="text" :value="grandTotal.toFixed(2)" class="w-full text-right h-10"
                                      readOnly />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  </Suspense>
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
import SalesOrderService from '@/Service/salesorderService';
import type { SalesOrderItemResource as PurchaseRequestItemResource, SalesOrderResource, SalesOrderSaveResource as PurchaseRequestSaveResource, SalesOrderSearch } from '@/Model/SalesOrder';
import { useToast } from 'primevue/usetoast';
import CustomerService from '@/Service/CustomerService';
import { Subscription } from 'rxjs';
import SelectCustom from '@/components/SelectCustom.vue';
import PriceList from '@/Model/GlobalVariable/PriceList'
import PaymentTermService from '@/Service/PaymentTermService';
import WarehouseService from '@/Service/WarehouseService';
import type { SelectItem } from '@/Model/BaseResource';
import router from '@/Router';
import ItemService from '@/Service/ItemService';
import type { PurchaseRequestSave as PurchaseRequestItem, PurchaseRequestItemSave, PurchaseRequestSave } from '@/Model/purchaseRequest';
import PurchaseRequestService from '@/Service/purchaseRequestService';

const subtotal = ref(0)
const vat = ref(0)
const otherCharges = ref(0)
const adjustment = ref(0)

const grandTotal = computed(() => {
  return subtotal.value + vat.value + otherCharges.value + adjustment.value
})

let subscription: Subscription;
const setStickyButtons = inject<any>('setStickyButtons');

const toast = useToast();
const loading = ref(false);
const error = ref('');
const SkipPick = ref(false);
const ddlPrice = new PriceList().getPriceList();
const pageNumber = ref(1)
const totalPages = ref(0)
const pageSize = ref(20)
const searchString = ref('')
const sortBy = ref('PRDate')
const direction = ref('DESC')
const totalRecords = ref(0)

const route = useRoute();
const PurchaseRequestNo: string = String(route.params.no);
const ddlCustomer = ref<SelectItem[]>([]);
const ddlPaymentTerm = ref<SelectItem[]>([]);
const ddlWarehouse = ref<SelectItem[]>([]);
const ddlItem = ref<SelectItem[]>([]);

const fetchLoading = ref(false);

const selectCustomer = ref<SelectItem | null>();
const selectPaymentTerm = ref<SelectItem | null>();
const selectWarehouse = ref<SelectItem | null>();
const selectItem = ref<SelectItem | null>();

const purchaseRequestItem = ref<PurchaseRequestItemSave[]>([]);
const purchaseRequestSave = ref<PurchaseRequestSave>({
  PurchaseRequestNo: '',
  CompanyId: 0,
  PurchaseRequestDate: new Date(),
  PaymentTerm: null,
  TermDescription: '',
  ReferenceNo: '',
  Vendor: null,
  StatusId: 0,
  DeliveryDate: new Date(),
  DueDate: new Date(),
  DeliveryAddress1: '',
  DeliveryAddress2: '',
  DeliveryCity: '',
  DeliveryState: '',
  DeliveryZipCode: '',
  DeliveryCountry: '',
  PersonInCharge: '',
  Currency: '',
  ExchangeRate: 0,
  TaxAmount: 0,
  DiscountRate: 0,
  DiscountAmount: 0,
  OtherCharges: 0,
  Subtotal: 0,
  Notes: '',
  TermAndConditions: '',
  TemplateId: 0,
  TotalAmount: 0,
  PurchaseRequestItems: [],
  UserId: '',
  IpAddress: '',
  Url: '',
  Project: '',
  Department: '',
  DDLItem: []
});
const remark = ref();
const cm = ref();
const selectedProduct = ref();
const focusedRowIndex = ref<number | null>(null);
const onFieldFocus = (index: number) => {
  focusedRowIndex.value = index;
};

const onFieldBlur = () => {
  focusedRowIndex.value = null;
};

const rowClass = (data: PurchaseRequestItem, index: number) => {
  return {
    'focused-row': focusedRowIndex.value === index
  };
};
const menuModel = ref([
  {
    label: 'Delete',
    icon: 'pi pi-fw pi-times',
    command: () => {
      if (selectedProduct.value) {
        deleteProduct(selectedProduct.value.data, selectedProduct.value.index);
      }
    }
  }
]);

// Modify the onRowContextMenu function to include index
const onRowContextMenu = (event: any) => {
  selectedProduct.value = event;
  cm.value.show(event.originalEvent);
};

// Modify the deleteProduct function to use the index
const deleteProduct = (data: PurchaseRequestItem, index: number) => {
  purchaseRequestSave.value.PurchaseRequestItems.splice(index, 1);
  toast.add({ severity: 'error', summary: 'Row Deleted', detail: `Line ${index + 1}`, life: 3000 });
  selectedProduct.value = null;
};


const getPaymentTermList = async (termId: string) => {
  fetchLoading.value = true;
  subscription = PaymentTermService.getPaymentTermList(parseInt(termId)).subscribe({
    next: (result) => {
      if (result.IsSuccess) {
        ddlPaymentTerm.value = ClonePaymentTermDDL(result.Data || []);
      } else {
        toast.add({ severity: 'error', summary: result.StatusCode.toString(), detail: result.Error?.Message, life: 2000 });
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

const fetchData = async () => {
  fetchLoading.value = true;
  subscription = PurchaseRequestService.get(PurchaseRequestNo).subscribe({
    next: (result: any) => {
      if (result.IsSuccess) {
        purchaseRequestSave.value = result.Data;
        if (purchaseRequestSave.value) {
          const paymentTerm = purchaseRequestSave.value.PaymentTerm

          if (paymentTerm) {
            getPaymentTermList(paymentTerm.TermId.toString());

            let selectDDL: SelectItem = {
              code: paymentTerm.TermId.toString(),
              name: paymentTerm.Description
            };
            selectPaymentTerm.value = selectDDL ?? {} as SelectItem;
          }

        }

      } else {
        toast.add({ severity: 'error', summary: result.StatusCode.toString(), detail: result.Error?.Message, life: 2000 });
      }
    },
    error: (error: any) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const getWarehouseList = async () => {
  fetchLoading.value = true;
  subscription = WarehouseService.getWarehouseList().subscribe({
    next: (result) => {
      if (result.IsSuccess) {
        ddlWarehouse.value = CloneWarehouseDDL(result.Data || []);
      } else {
        toast.add({ severity: 'error', summary: result.StatusCode.toString(), detail: result.Error?.Message, life: 2000 });
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


const getItemList = async (event: string, rowIndex: number) => {
  fetchLoading.value = true;
  searchString.value = event;
  const endpoint = `${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${searchString.value}`;
  subscription = ItemService.getitemList(endpoint).subscribe({
    next: (result) => {
      if (result.IsSuccess) {
        purchaseRequestItem.value[rowIndex].DDLItem = CloneItemDDL(result.Data || []);
      } else {
        toast.add({ severity: 'error', summary: result.StatusCode.toString(), detail: result.Error?.Message, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
}

const CloneItemDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.ItemCode == "" ? "--All--" : option.ItemCode,
    code: option.ItemId == 0 ? "0" : option.ItemId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const ClonePaymentTermDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.Description == "" ? "--All--" : option.Description,
    code: option.TermId == 0 ? "0" : option.TermId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneWarehouseDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.WarehouseName == "" ? "--All--" : option.WarehouseName,
    code: option.WarehouseID == 0 ? "0" : option.WarehouseId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneCustomerDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.CustomerName == "" ? "--All--" : option.CustomerName,
    code: option.CustomerId == 0 ? "0" : option.CustomerID.toString(),
  }));

  return data.length > 0 ? data : [];
}

const addRow = () => {
  let prItem: PurchaseRequestItemSave = {
    PurchaseRequestNo: ' ',
    CompanyId: 0,
    LineNumber: 0,
    ItemId: 0,
    ItemCode: '',
    Description: '',
    RequiredDate: '',
    OrderQuantity: 0,
    Unit: '',
    UnitCost: 0,
    DiscountRate: 0,
    DiscountAmount: 0,
    VatId: 0,
    VatCode: '',
    VatRate: 0,
    VatAmount: 0,
    LineTotal: 0,
    PurchaseOrderNo: '',
    ReferenceNo: '',
    ReferenceLineNumber: 0,
    DDLItem: [],
  };

  purchaseRequestItem.value.push(prItem);
}

const SavePurchaseRequest = () => {
  console.log('save');
}

onUnmounted(() => {
  if (subscription)
    subscription.unsubscribe();

  setStickyButtons([]);

})
onMounted(() => {
  purchaseRequestSave.value.PurchaseRequestNo = "-- Auto Numbering --";
  if (PurchaseRequestNo != '') {
    fetchData()
  }

  setStickyButtons([
    {
      icon: 'pi pi-cog',
      label: 'Save',
      severity: 'info',
      action: () => {
        SavePurchaseRequest()
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
        await router.push({ name: 'PurchaseRequestList' })
      }
    }
  ]);

})
</script>