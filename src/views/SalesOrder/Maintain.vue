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
                <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">Sales Order</span>
              </div>
            </div>
          </template>
          <template #content>
            <form @submit.prevent="">
              <div class="card flex flex-col lg:flex-row justify-center gap-10">
                <div class="flex flex-col w-full lg:w-1/3 gap-2">
                  <label for="labelFor" class="font-semibold text-lg">Customer</label>
                  <SelectCustom v-model="selectCustomer" :options="ddlCustomer" :loading="fetchLoading"
                    class="w-full min-w-80" placeholder="Select a customer" @filter="getCustomerList" optionLabel="name"
                    dataKey="code" @update:modelValue="onSelectCustomer" :invalid="!selectCustomer" />

                  <Message v-if="selectCustomer == null" severity="error" class="w-fit">
                    Please Select Customer
                  </Message>
                </div>
                <div class="flex flex-col lg:flex-row w-full gap-4">
                  <!-- Left Card -->
                  <div class="flex-1">
                    <Card class="w-full">
                      <template #title>
                        <div class="portlet-title">
                          <div class="caption">
                            <span class="uppercase font-bold text-lg">Billing Info</span>
                          </div>
                        </div>
                      </template>
                      <template #content>
                        <div class="flex flex-col gap-2">
                          <span class="font-normal">{{ salesOrderSave?.Customer?.BillingAddress1 }} {{
                            salesOrderSave?.Customer?.BillingAddress2 }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.BillingAmphur }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.BillingProvince }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.BillingCountry }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.BillingPostalCode }}</span>
                        </div>
                      </template>
                    </Card>
                  </div>

                  <!-- Right Card -->
                  <div class="flex-1">
                    <Card class="w-full">
                      <template #title>
                        <div class="portlet-title">
                          <div class="caption">
                            <span class="uppercase font-bold text-lg">Shipping Info</span>
                          </div>
                        </div>
                      </template>
                      <template #content>
                        <div class="flex flex-col gap-2">
                          <span class="font-normal">{{ salesOrderSave?.Customer?.ShippingAddress1 }} {{
                            salesOrderSave?.Customer?.ShippingAddress2 }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.ShippingAmphur }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.ShippingProvince }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.ShippingCountry }}</span>
                          <span class="font-normal">{{ salesOrderSave?.Customer?.ShippingPostalCode }}</span>
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </div>
              <Fluid>
                <div class="flex flex-col md:flex-row">
                  <div class="md:w-2/4">
                    <div class="card flex flex-col gap-4">
                      <div class="grid grid-cols-12 gap-2">
                        <label for="SONo"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Sales
                          Order No.</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputGroup>
                            <InputText v-model="salesOrderSave.SalesOrderNumber" variant="filled" readonly="true" />
                            <Button icon="pi pi-cog" severity="help" @click="" />
                            <!-- <Button icon="pi pi-bars" class="p-button-text" severity="info"
                              v-styleclass="{ selector: '#searchDetail', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }" /> -->
                          </InputGroup>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Plan Ship Date"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Plan
                          Ship Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="salesOrderSave.DeliveryDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Payment Term"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Payment
                          Term</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPaymentTerm" :options="ddlPaymentTerm" :loading="fetchLoading"
                            placeholder="Select a payment term" @filter="getPaymentTermList" optionLabel="name"
                            dataKey="code" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Sales
                          Person</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPIC" :options="ddlPIC" :loading="fetchLoading"
                            placeholder="Select a sales person" @filter="getPIC" optionLabel="name" dataKey="code">
                            <template #option="slotProps">
                              <div class="flex flex-col gap-2">
                                <label for="username">{{ slotProps.option.name }}</label>
                                <small id="username-help">{{ slotProps.option.code }}</small>
                              </div>
                            </template>
                          </SelectCustom>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Ship
                          From</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectWarehouse" :options="ddlWarehouse" :loading="fetchLoading"
                            placeholder="Select a Warehouse" @filter="getWarehouseList" optionLabel="name" @update:model-value="salesOrderSave.WarehouseID = parseInt(selectWarehouse?.code ?? '0');"
                            dataKey="code" :invalid="!selectWarehouse" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <InputGroup
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">
                          <label for="Ship From" class="">
                            Skip Pick & Ship <i v-tooltip.bottom="'To skip picking and shippping process'"
                              class="pi pi-exclamation-circle"></i></label>
                        </InputGroup>
                        <div class="col-span-12 md:col-span-8">
                          <Checkbox v-model="salesOrderSave.SkipPicking" :binary="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="md:w-2/4">
                    <div class="card flex flex-col gap-4">
                      <div class="grid grid-cols-12 gap-2">
                        <label for="SODate"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Order
                          Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="salesOrderSave.SalesOrderDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" :invalid="!salesOrderSave.DueDate" />
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
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Due
                          Date</label>
                        <div class="col-span-12 md:col-span-8">
                          <DatePicker v-model="salesOrderSave.DueDate" variant="filled" showButtonBar showIcon fluid
                            :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Price
                          List</label>
                        <div class="col-span-12 md:col-span-8">
                          <Select v-model="salesOrderSave.PriceTier" placeholder="Select a price tier"
                            :options="ddlPrice" optionLabel="name" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Shipping
                          Address</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputText id="name3" type="text" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Subject</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputText id="name3" type="text" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Detail -->
                <div class="card">
                  <Suspense>
                    <Tabs :lazy="true" value="1">
                      <TabList>
                        <Tab value="1">Order</Tab>
                        <Tab disabled value="2">Pick</Tab>
                        <Tab disabled value="3">Ship</Tab>
                      </TabList>
                      <TabPanel :lazy="true" value="1" header="Order">
                        <div class="row invoice-body mb-8">
                          <div class="col-xs-12 table-wrapper">
                            <ContextMenu ref="cm" :model="menuModel" @hide="selectedProduct = null" />
                            <DataTable :value="salesOrderSave.SalesOrderItemResource" tableStyle="min-width: 50rem;"
                              contextMenu v-model:contextMenuSelection="selectedProduct" scrollable
                              scroll-height="30rem" columnResizeMode="fit" @rowContextmenu="onRowContextMenu"
                              :rowclass="rowClass">

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

                                  <SelectCustom v-model="data.SelectItem" :options="data.DDLItem"
                                    :disabled="!selectWarehouse" :loading="fetchLoading" placeholder="Select an item"
                                    @filter="(event) => getItemList(event, index)" optionLabel="ItemCode"
                                    dataKey="itemId" :key="`code-${index}`"
                                    @update:model-value="itemSelecChange(data.SelectItem,index)">

                                    <template #option="slotProps">
                                      <Card class="w-[400px] min-w-56">
                                        <template #title>
                                          <div class="caption">
                                            <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">
                                              <i class="pi pi-credit-card"></i> Item Code : {{ slotProps.option.ItemCode
                                              }}
                                            </span>
                                          </div>
                                        </template>
                                        <template #content>
                                          <div class="text-start">
                                            <div><i class="pi pi-barcode text-primary" aria-hidden="true"></i><b> Item
                                                Name : </b>
                                              <Tag severity="info" :value="slotProps.option.ItemName" />
                                            </div>
                                            <div><i class="pi pi-user text-primary" aria-hidden="true"></i><b> Customer
                                                Item Code : </b>
                                              <Tag severity="info" :value=" slotProps.option.CustomerItemCode || '-'" />
                                            </div>
                                            <div><i class="pi pi-info text-primary" aria-hidden="true"></i><b> Available
                                                Qty(All) : </b>
                                              <Tag severity="info" :value=" slotProps.option.AvailableQty || '-'" />
                                            </div>
                                          </div>
                                        </template>
                                      </Card>
                                    </template>
                                  </SelectCustom>
                                </template>
                              </Column>

                              <!-- Item Name Column with unique key -->
                              <Column field="itemName" header="Description" class="min-w-60">
                                <template #body="{ data, index }">
                                  <Textarea v-model="data.ItemName" rows="2" cols="30" :key="`itemName-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="DeliveryDate" header="Delivery Date" class="min-w-60">
                                <template #body="{ data, index }">
                                  <DatePicker v-model="data.DeliveryDate" @focus="onFieldFocus(index)" showButtonBar
                                    showIcon fluid :manual-input="false" @blur="onFieldBlur" variant="filled"
                                    :key="`DeliveryDate-${index}`" />
                                </template>
                              </Column>

                              <Column field="AvaliableQty" header="Available Qty" class="min-w-36">
                              </Column>

                              <!-- Order Qty Column with unique key -->
                              <Column field="OrderQty" header="Order Qty" class="w-40">
                                <template #body="{ data, index }">
                                  <InputNumber v-model="data.OrderQty" class="min-w-36" @focus="onFieldFocus(index)"
                                    @blur="onFieldBlur(index)" @update:modelValue="calculateLineTotal(data)"
                                    :key="`orderQty-${index}`" /> <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="selectUOM" header="UOM" class="min-w-60">
                                <template #body="{ data, index }">
                                  <Select placeholder="Select a UOM" v-model="data.SelectUOM" :options="data.DDLUOM"
                                    optionLabel="ItemName" @update:modelValue="data.Unit = data.SelectUOM.ItemName; data.UnitID = data.SelectUOM.ItemID;" 
                                    dataKey="ItemID" :key="`UOM-${index}`"></Select>
                                </template>
                              </Column>

                              <!-- Unit Price Column with unique key -->
                              <Column field="UnitPrice" header="Unit Price">
                                <template #body="{ data, index }">
                                  <InputNumber v-model="data.UnitPrice" class="min-w-36" mode="currency" currency="THB"
                                    locale="th-TH" @focus="onFieldFocus(index)" @blur="onFieldBlur(index)"
                                    @update:modelValue="calculateLineTotal(data)" :key="`unitPrice-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="DiscountRate" header="Discount">
                                <template #body="{ data, index }">
                                  <InputText v-model="data.DiscountRate" class="min-w-36" @focus="onFieldFocus(index)"
                                    @blur="onFieldBlur(index)" @update:modelValue="calculateLineTotal(data)"
                                    :key="`DiscountRate-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="TaxID" header="Vat">
                                <template #body="{ data, index }">
                                  <!-- <InputNumber v-model="data.TaxID" class="min-w-36" @focus="onFieldFocus(index)"
                                    @blur="onFieldBlur(index)" @update:modelValue="calculateLineTotal(data)" :key="`Vat-${index}`" /> -->
                                  <Select placeholder="Select a Tax" v-model="data.SelectTax" :options="data.DDLTAX"
                                    optionLabel="TaxName" @update:modelValue="calculateLineTotal(data)"
                                    dataKey="TaxCode" :key="`Vat-${index}`"></Select>
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="LineTotal" header="Total" class="min-w-28">
                                <template #body="{ data, index }">
                                  {{ formatCurrency(data.LineTotal) }}
                                </template>
                              </Column>
                            </DataTable>
                          </div>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </Suspense>
                </div>
                <div class="flex flex-col gap-x-20 lg:flex-row w-full">
                  <!-- Left Card -->
                  <div class="flex flex-col w-full lg:w-1/2 gap-4 p-2">
                    <div class="flex flex-col gap-2">
                      <label for="Remark" class="font-semibold">Remark</label>
                      <Textarea id="Remark" rows="5" cols="30" v-model="salesOrderSave.Remark"
                        aria-describedby="username-help" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label for="Memo" class="font-semibold">Internal Memo</label>
                      <Textarea id="Memo" rows="5" cols="30" v-model="salesOrderSave.InternalMemo"
                        aria-describedby="username-help" />
                    </div>
                  </div>

                  <!-- Right Card -->
                  <div class="flex flex-col w-full lg:w-1/2 gap-4 p-2">
                    <div class="grid grid-cols-12 gap-2">
                      <label for="name3"
                        class="flex items-center font-semibold col-span-12 mb-2 md:col-span-2 md:mb-0">Subtotal</label>
                      <div class="col-span-12 md:col-span-10">
                      </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                      <label for="email3"
                        class="flex items-center font-semibold col-span-12 mb-2 md:col-span-2 md:mb-0">Discount</label>
                      <div class="col-span-12 md:col-span-10">
                        <InputText id="email3" type="text" />
                      </div>
                    </div>
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
import SalesOrderService from '@/service/salesorderService';
import type { SalesOrderItemResource, SalesOrderResource, SalesOrderSaveResource, SalesOrderSearch } from '@/Model/SalesOrder';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import SelectCustom from '@/components/SelectCustom.vue';
import PriceList from '@/Model/GlobalVariable/PriceList'
import type { SelectItem } from '@/Model/BaseResource';
import router from '@/router';
import ItemService from '@/service/ItemService';
import type { ItemSearch } from '@/Model/Item';
import DatePicker from 'primevue/datepicker';
import CustomerService from '@/service/customerService';
import WarehouseService from '@/service/warehouseService';
import PaymentTermService from '@/service/paymentTermService';
import userService from '@/service/userService';
import taxService from '@/service/taxService';
import salesorderService from '@/service/salesorderService';

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
const SalesOrderNo: string = String(route.params.id);
const ddlCustomer = ref<SelectItem[]>([]);
const ddlPaymentTerm = ref<SelectItem[]>([]);
const ddlWarehouse = ref<SelectItem[]>([]);
const ddlPIC = ref<SelectItem[]>([]);
const fetchLoading = ref(false);

const selectCustomer = ref<SelectItem | null>();
const selectPaymentTerm = ref<SelectItem | null>();
const selectWarehouse = ref<SelectItem | null>();
const selectPIC = ref<SelectItem | null>();

const salesOrderSave = ref<SalesOrderSaveResource>({
  SalesOrderID: 0,
  SalesOrderNumber: '',
  SalesOrderDate: new Date(),
  AssociatedSONo: '',
  Customer: null,
  WarehouseID: 0,
  ReferenceNo: '',
  RefQuotationNo: '',
  PaymentTerm: null,
  DeliveryDate: new Date(),
  DueDate: new Date(),
  PersonInCharge: '',
  Currency: '',
  DiscountRate: 0,
  DiscountAmount: 0,
  OtherCharges: 0,
  SkipPicking: false,
  Status: null,
  PickStatus: 0,
  PackStatus: 0,
  ShipStatus: 0,
  IsBackOrder: false,
  IsSplitOrder: false,
  Notes: '',
  InternalMemo: '',
  MemoDate: new Date(),
  MemoBy: '',
  IsPriceExcludeVat: false,
  PriceTier: 0,
  SalesOrderItemResource: []
});
const cm = ref();
const selectedProduct = ref();
const focusedRowIndex = ref<number | null>(null);
const onFieldFocus = (index: number) => {
  focusedRowIndex.value = index;
};

const onFieldBlur = (index: number) => {
  focusedRowIndex.value = null;
};

const rowClass = (data: SalesOrderItemResource, index: number) => {
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

const itemSelecChange = (event: SalesOrderItemResource,index: number) =>{
  fetchLoading.value = true;
  subscription = ItemService.getitemByItemID(event.ItemId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.SalesOrderItemResource[index].ItemId = result.data.itemId;
        salesOrderSave.value.SalesOrderItemResource[index].ItemCode = result.data.itemCode;
        salesOrderSave.value.SalesOrderItemResource[index].ItemName = result.data.itemName;
        salesOrderSave.value.SalesOrderItemResource[index].AvaliableQty = result.data.availableQty;
        salesOrderSave.value.SalesOrderItemResource[index].UnitPrice = result.data.unitPrice;
        getUOMByItemId(event.ItemId,index);
        getTaxList(0,index);
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
}

const getTaxList = (taxId: number,index: number) => {
  subscription = taxService.getTaxList(taxId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.SalesOrderItemResource[index].DDLTAX = result.data;
      } 
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    }
  })
}

const getUOMByItemId = (itemId: number,index: number) => {
  subscription = ItemService.getUOMByItemId(itemId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.SalesOrderItemResource[index].DDLUOM = result.data;
        console.log(salesOrderSave.value.SalesOrderItemResource[index].DDLUOM);
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    }
  })
}


// Modify the onRowContextMenu function to include index
const onRowContextMenu = (event: any) => {
  selectedProduct.value = event;
  cm.value.show(event.originalEvent);
};

// Modify the deleteProduct function to use the index
const deleteProduct = (data: SalesOrderItemResource, index: number) => {
  salesOrderSave.value.SalesOrderItemResource.splice(index, 1);
  toast.add({ severity: 'error', summary: 'Row Deleted', detail: `Line ${index + 1}`, life: 3000 });
  selectedProduct.value = null;
};

const onSelectCustomer = (event: SelectItem) => {
  fetchLoading.value = true;
  subscription = CustomerService.getCustomerById(parseInt(event.code)).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        if (salesOrderSave.value) {
          salesOrderSave.value.Customer = result.data;
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
}

const getCustomerList = async (event: string) => {
  searchString.value = event;
  const endpoint = `${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`;
  fetchLoading.value = true;
  subscription = CustomerService.getCustomerList(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlCustomer.value = CloneCustomerDDL(result.data || []);
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

const getPaymentTermList = async (termId: string) => {
  fetchLoading.value = true;
  subscription = PaymentTermService.getPaymentTermList(parseInt(termId)).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlPaymentTerm.value = ClonePaymentTermDDL(result.data || []);
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

const getWarehouseList = async () => {
  fetchLoading.value = true;
  subscription = WarehouseService.getWarehouseList().subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlWarehouse.value = CloneWarehouseDDL(result.data || []);
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

const fetchData = async () => {
  fetchLoading.value = true;
  subscription = SalesOrderService.get(SalesOrderNo).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value = result.data;
        if (salesOrderSave.value) {
          const customer = salesOrderSave.value.Customer
          const paymentTerm = salesOrderSave.value.PaymentTerm

          if (customer) {
            getCustomerList(customer.CustomerName);

            let selectDDL: SelectItem = {
              code: customer.CustomerId.toString(),
              name: customer.CustomerName
            };
            selectCustomer.value = selectDDL ?? {} as SelectItem;
          }

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
        debugger
        ddlPIC.value = CloneUserDDL(result.data || []);
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

const getItemList = async (event: string, rowIndex: number) => {
  fetchLoading.value = true;
  searchString.value = event;
  const search: ItemSearch = {
    searchString: event,
    sortBy: sortKey.value,
    sortDirection: sortOrder.value,
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    warehouseID:  selectWarehouse == null ? 0 : parseInt(selectWarehouse.value?.code ?? '0')
  };

  subscription = ItemService.getitemFilter(search).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.SalesOrderItemResource[rowIndex].DDLItem = result.data;
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

const CloneUserDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.FirstName == "" ? "--All--" : option.FirstName + ' ' + option.LastName,
    code: option.Email == "" ? "0" : option.Email,
  }));

  return data.length > 0 ? data : [];
}

const addRow = () => {
  let soItem: SalesOrderItemResource = {
    SalesOrderItemID: 0,
    SalesOrderNumber: '',
    CompanyID: 0,
    LineNumber: 0,
    ItemId: 0,
    ItemCode: '',
    ItemName: '',
    DeliveryDate: new Date(),
    UnitCost: 0,
    BaseUnitPrice: 0,
    UnitPrice: 0,
    AvaliableQty: 0,
    OrderQty: 0,
    Unit: '',
    UnitID: 0,
    BaseUnit: '',
    BaseUnitID: 0,
    ConversionQty: 0,
    BaseUnitQty: 0,
    DiscountRate: '',
    DiscountAmount: 0,
    TaxID: 0,
    TaxCode: '',
    TaxRate: 0,
    TaxAmount: 0,
    LineTotal: 0,
    Description: '',
    Image: '',
    ShippedQty: 0,
    ShippedAmount: 0,
    BalanceQty: 0,
    BalanceAmount: 0,
    ParentLineId: 0,
    FreeItemFlag: false,
    TrackStock: false,
    SelectItem: {},
    SelectUOM:  {},
    SelectTax: {},
    DDLItem: [],
    DDLUOM: [],
    DDLTAX: []
  };

  salesOrderSave.value.SalesOrderItemResource.push(soItem);
}

const SaveSalesOrder = () => {
  console.log(salesOrderSave.value);
  subscription = salesorderService.saveSalesOrder(salesOrderSave.value).subscribe({
    next: (result) => {
      if (result.isSuccess) { 
        debugger
        router.push({ name: 'SalesOrderDetail', params: result.data})
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
}

const calculateLineTotal = (data: SalesOrderItemResource) => {
  const quantity = data.OrderQty || 0;
  const unitPrice = data.UnitPrice || 0;
  data.TaxCode = data.SelectTax.TaxCode;
  data.TaxID = data.SelectTax.TaxId || 0;
  data.TaxRate = data.SelectTax.Value || 0;
  data.TaxAmount = data.TaxRate / 100;

  const subtotal = quantity * unitPrice;
  if (typeof data.DiscountRate === 'string' && data.DiscountRate.includes('%')) {
    const discountPercentage = parseFloat(data.DiscountRate) || 0;
    data.DiscountAmount = subtotal * (discountPercentage / 100);
  } else {
    data.DiscountAmount = parseFloat(data.DiscountRate as string) || 0;
  }
  const vatAmount = (subtotal - data.DiscountAmount) * data.TaxAmount;
  
  data.LineTotal = subtotal - data.DiscountAmount + vatAmount;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
};

onUnmounted(() => {
  if (subscription)
    subscription.unsubscribe();

  setStickyButtons([]);

})
onMounted(() => {
  salesOrderSave.value.SalesOrderNumber = "-- ออกโดยระบบ --";
  if (SalesOrderNo != '') {
    fetchData()
  }

  setStickyButtons([
    {
      icon: 'pi pi-cog',
      label: 'Save',
      severity: 'info',
      action: () => {
        SaveSalesOrder()
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
        await router.push({ name: 'SalesOrder' })
      }
    }
  ]);

})
</script>