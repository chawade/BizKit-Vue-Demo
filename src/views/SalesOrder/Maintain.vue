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
                          <span class="font-normal">{{ salesOrderSave?.customer?.billingAddress1 }} {{
                            salesOrderSave?.customer?.billingAddress2 }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.billingAmphur }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.billingProvince }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.billingCountry }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.billingPostalCode }}</span>
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
                          <span class="font-normal">{{ salesOrderSave?.customer?.shippingAddress1 }} {{
                            salesOrderSave?.customer?.shippingAddress2 }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.shippingAmphur }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.shippingProvince }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.shippingCountry }}</span>
                          <span class="font-normal">{{ salesOrderSave?.customer?.shippingPostalCode }}</span>
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
                            <InputText v-model="salesOrderSave.salesOrderNumber" variant="filled" readonly="true" />
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
                          <DatePicker v-model="salesOrderSave.deliveryDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Payment Term"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Payment
                          Term</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPaymentTerm" :options="ddlPaymentTerm" :loading="fetchLoading"
                            placeholder="Select a payment term" @update:model-value="onSelectPaymentTerm"
                            optionLabel="description" dataKey="termId" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Sales
                          Person</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPIC" :options="ddlPIC" :loading="fetchLoading"
                            placeholder="Select a sales person" optionLabel="name" dataKey="code">
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
                            placeholder="Select a Warehouse" optionLabel="name"
                            @update:model-value="salesOrderSave.warehouseID = parseInt(selectWarehouse?.code ?? '0');"
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
                          <Checkbox v-model="salesOrderSave.skipPicking" :binary="true" />
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
                          <DatePicker v-model="salesOrderSave.salesOrderDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" :invalid="!salesOrderSave.dueDate" />
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
                          <DatePicker v-model="salesOrderSave.dueDate" variant="filled" showButtonBar showIcon fluid
                            :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Sales Person"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Price
                          List</label>
                        <div class="col-span-12 md:col-span-8">
                          <Select v-model="salesOrderSave.priceTier" placeholder="Select a price tier"
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
                            <TransitionGroup name="fade" tag="div">

                            </TransitionGroup>
                            <ContextMenu ref="cm" :model="menuModel" @hide="selectedProduct = null" />
                            <DataTable :value="salesOrderSave.salesOrderItemResource" tableStyle="min-width: 50rem;"
                              @rowReorder="onRowReorder" contextMenu v-model:contextMenuSelection="selectedProduct"
                              scrollable :reorderableColumns="true" scroll-height="30rem" columnResizeMode="fit"
                              @rowContextmenu="onRowContextMenu" :rowclass="rowClass">

                              <template #header>
                                <Toolbar>
                                  <template #start>
                                    <Select v-model="selectisPriceExcludeVat" :options="isPriceExcludeVat"
                                      @update:model-value="salesOrderSave.isPriceExcludeVat = selectisPriceExcludeVat.code"
                                      optionLabel="name" dataKey="code" class="min-w-52" />
                                  </template>
                                  <template #end>
                                    <Button type="button" icon="pi pi-plus-circle" label="Add" raised @click="addRow" />

                                  </template>
                                </Toolbar>
                              </template>
                              <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />
                              <!-- LineNumber -->
                              <Column field="LineNumber" header="No.">
                                <template #body="{ data, index }">
                                  {{ index + 1 }}
                                </template>
                              </Column>

                              <!-- Item Code Column with unique key -->
                              <Column field="selectItem" class="min-w-60">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    Item Code
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <SelectCustom v-model="data.SelectItem" :options="data.DDLItem"
                                    :disabled="!selectWarehouse" :loading="fetchLoading" placeholder="Select an item"
                                    @filter="(event) => getItemList(event, index)" optionLabel="itemCode"
                                    dataKey="itemId" :key="`code-${index}`"
                                    @update:model-value="itemSelecChange(data.SelectItem, index)">

                                    <template #option="slotProps">
                                      <Card class="w-[400px] min-w-56">
                                        <template #title>
                                          <div class="caption">
                                            <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">
                                              <i class="pi pi-credit-card"></i> Item Code : {{ slotProps.option.itemCode
                                              }}
                                            </span>
                                          </div>
                                        </template>
                                        <template #content>
                                          <div class="text-start">
                                            <div><i class="pi pi-barcode text-primary" aria-hidden="true"></i><b> Item
                                                Name : </b>
                                              <Tag severity="info" :value="slotProps.option.itemName" />
                                            </div>
                                            <div><i class="pi pi-user text-primary" aria-hidden="true"></i><b> Customer
                                                Item Code : </b>
                                              <Tag severity="info" :value="slotProps.option.customerItemCode || '-'" />
                                            </div>
                                            <div><i class="pi pi-info text-primary" aria-hidden="true"></i><b> Available
                                                Qty(All) : </b>
                                              <Tag severity="info" :value="slotProps.option.availableQty || '-'" />
                                            </div>
                                          </div>
                                        </template>
                                      </Card>
                                    </template>
                                  </SelectCustom>
                                </template>
                              </Column>

                              <!-- Item Name Column with unique key -->
                              <Column field="itemName" class="min-w-60">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    item Name
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <Textarea v-model="data.itemName" rows="2" cols="30" :key="`itemName-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="deliveryDate" class="min-w-60">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    Delivery Date
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <DatePicker v-model="data.deliveryDate" showButtonBar showIcon fluid
                                    :manual-input="false" variant="filled" :key="`DeliveryDate-${index}`" />
                                </template>
                              </Column>

                              <Column field="availableQty" class="min-w-36">
                                <template #header>
                                  <div class="w-full font-bold text-right">
                                    Available Qty
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <div class="text-end">
                                    {{ data.availableQty }}
                                  </div>
                                </template>
                              </Column>

                              <!-- Order Qty Column with unique key -->
                              <Column field="orderQty" class="w-40">
                                <template #header>
                                  <div class="w-full font-bold text-right">
                                    Order Qty
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <InputNumber v-model="data.orderQty" :minFractionDigits="2" :maxFractionDigits="5"
                                    class="min-w-36" @focus="onFieldFocus(index)" :inputStyle="{ textAlign: 'right' }"
                                    @update:modelValue="calculateLineTotal(data)" :key="`orderQty-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="selectUOM" class="min-w-60">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    UOM
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <Select placeholder="Select a UOM" v-model="data.SelectUOM" :options="data.DDLUOM"
                                    optionLabel="itemName"
                                    @update:modelValue="data.unit = data.SelectUOM.itemName; data.unitID = data.SelectUOM.itemID;"
                                    dataKey="itemID" :key="`UOM-${index}`"></Select>
                                </template>
                              </Column>

                              <!-- Unit Price Column with unique key -->
                              <Column field="unitPrice">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    Unit Price
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <InputNumber v-model="data.unitPrice" class="min-w-36" mode="currency" currency="THB"
                                    locale="th-TH" @focus="onFieldFocus(index)" :inputStyle="{ textAlign: 'right' }"
                                    @update:modelValue="calculateLineTotal(data)" :key="`unitPrice-${index}`" />
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="discountRate">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    Discount
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <InputGroup>
                                    <InputNumber v-model="data.discountRate" :inputStyle="{ textAlign: 'right' }"
                                      :minFractionDigits="2" :maxFractionDigits="5"
                                      :currency="data.discountRateMode ? 'THB' : undefined"
                                      :suffix="data.discountRateMode ? '%' : undefined" class="min-w-32"
                                      @update:modelValue="calculateLineTotal(data)" :key="`DiscountRate-${index}`" />
                                    <ToggleButton @change="calculateLineTotal(data)" v-model="data.discountRateMode"
                                      onLabel="On" offLabel="Off" off-icon="pi pi-percentage"
                                      onIcon="pi pi-percentage" />
                                  </InputGroup>
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="taxID">
                                <template #header>
                                  <div class="w-full font-bold text-center">
                                    Vat
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <Select placeholder="Select a Tax" v-model="data.SelectTax" :options="data.DDLTAX"
                                    optionLabel="taxName" @update:modelValue="calculateLineTotal(data)"
                                    dataKey="taxCode" :key="`Vat-${index}`"></Select>
                                  <!-- key added here -->
                                </template>
                              </Column>

                              <Column field="lineTotal">
                                <template #header>
                                  <div class="w-full font-bold text-right">
                                    Total
                                  </div>
                                </template>
                                <template #body="{ data, index }">
                                  <div class="min-w-28 text-right">
                                    {{ formatCurrency(data.lineTotal) }}
                                  </div>
                                </template>
                              </Column>
                            </DataTable>
                          </div>
                        </div>
                      </TabPanel>
                    </Tabs>
                  </Suspense>
                </div>
                <div class="flex flex-col gap-x-20 lg:flex-row w-full p-10">
                  <!-- Left Card -->
                  <div class="flex flex-col w-full lg:w-1/2 gap-4 p-2">
                    <div class="flex flex-col gap-2">
                      <label for="Remark" class="font-semibold">Remark</label>
                      <Textarea id="Remark" rows="5" cols="30" v-model="salesOrderSave.remark"
                        aria-describedby="username-help" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label for="Memo" class="font-semibold">Internal Memo</label>
                      <Textarea id="Memo" rows="5" cols="30" v-model="salesOrderSave.internalMemo"
                        aria-describedby="username-help" />
                    </div>
                  </div>

                  <!-- Right Card -->
                  <Card>
                    <template #content>
                      <div class="flex flex-col w-full gap-4 p-2">
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="name3" class="font-semibold col-span-4">Subtotal</label>
                          <Message class="col-span-4" severity="secondary">
                            <template #container>
                              <div class="text-right p-2 mr-1">
                                {{ formatCurrency(calculateFooter.subtotal) }}
                              </div>
                            </template>
                          </Message>
                        </div>
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="email3" class="font-semibold col-span-4">Discount</label>
                          <div class="col-span-4">
                            <InputGroup>
                              <InputNumber class="max-w-16" :inputStyle="{ textAlign: 'right' }" :max="100" 
                              :min="0" v-model="salesOrderSave.discountRate" />
                              <InputGroupAddon>%</InputGroupAddon>
                              <InputNumber :inputStyle="{ textAlign: 'right' }" v-model="salesOrderSave.discountAmount"
                                mode="currency" currency="THB" locale="th-TH" />
                            </InputGroup>
                          </div>
                        </div>
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="name3" class="font-semibold col-span-4">Net Amount</label>
                          <Message class="col-span-4" severity="secondary">
                            <template #container>
                              <div class="text-right p-2 mr-1">

                                {{ formatCurrency(calculateFooter.netAmount) }}
                              </div>
                            </template>
                          </Message>
                        </div>
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="email3" class="font-semibold col-span-4">Amount before VAT</label>
                          <Message class="col-span-4" severity="secondary">
                            <template #container>
                              <div class="text-right p-2 mr-1">
                                {{ formatCurrency(calculateFooter.baseVatAmount) }}
                              </div>
                            </template>
                          </Message>
                        </div>
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="email3" class="font-semibold col-span-4">Tax</label>
                          <Message class="col-span-4" severity="secondary">
                            <template #container>
                              <div class="text-right p-2 mr-1">
                                {{ formatCurrency(calculateFooter.taxAmount) }}
                              </div>
                            </template>
                          </Message>
                        </div>
                        <div class="grid grid-cols-8 items-center gap-2">
                          <label for="email3" class="font-semibold col-span-4">Other Charges</label>
                          <div class="col-span-4">
                            <InputNumber :inputStyle="{ textAlign: 'right' }" v-model="salesOrderSave.otherCharges"
                              mode="currency" currency="THB" locale="th-TH" />
                          </div>
                        </div>
                        <div class="grid grid-cols-8 h-full items-center gap-2">
                          <label for="email3" class="font-bold col-span-4">Grand Total</label>
                          <Message class="col-span-4" severity="secondary">
                            <template #container>
                              <div class="text-right p-2 mr-1">
                                {{ formatCurrency(calculateFooter.grandTotal) }}
                              </div>
                            </template>
                          </Message>
                        </div>
                      </div>
                    </template>
                  </Card>

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
import type { PaymentTermListResource } from '@/Model/PaymentTerm';
import type { DataTableRowReorderEvent } from 'primevue/datatable';

let subscription: Subscription;
const setStickyButtons = inject<any>('setStickyButtons');

const toast = useToast();
const loading = ref(false);
const error = ref('');
const ddlPrice = new PriceList().getPriceList();
const currentPage = ref(1)
const pageSize = ref(20)
const searchString = ref('')
const sortKey = ref('CustomerName')
const sortOrder = ref('DESC')

const route = useRoute();
const SalesOrderNo: string = String(route.params.id);
const ddlCustomer = ref<SelectItem[]>([]);
const ddlPaymentTerm = ref<PaymentTermListResource[]>([]);
const ddlWarehouse = ref<SelectItem[]>([]);
const ddlPIC = ref<SelectItem[]>([]);
const fetchLoading = ref(false);

const selectCustomer = ref<SelectItem | null>();
const selectPaymentTerm = ref<PaymentTermListResource | null>();
const selectWarehouse = ref<SelectItem | null>();
const selectPIC = ref<SelectItem | null>();

const selectisPriceExcludeVat = ref<SelectItem>({
  code: true, name: 'Price excludes VAT'
});
const isPriceExcludeVat = reactive<SelectItem[]>([
  { code: true, name: 'Price excludes VAT' },
  { code: false, name: 'Price includes VAT' }
])

const salesOrderSave = ref<SalesOrderSaveResource>({
  salesOrderID: 0,
  salesOrderNumber: '',
  salesOrderDate: new Date(),
  associatedSONo: '',
  customer: null,
  warehouseID: 0,
  referenceNo: '',
  refQuotationNo: '',
  paymentTerm: null,
  deliveryDate: new Date(),
  dueDate: new Date(),
  personInCharge: '',
  currency: '',
  discountRate: 0,
  discountAmount: 0,
  otherCharges: 0,
  skipPicking: false,
  status: null,
  pickStatus: 0,
  packStatus: 0,
  shipStatus: 0,
  isBackOrder: false,
  isSplitOrder: false,
  notes: '',
  internalMemo: '',
  memoDate: new Date(),
  memoBy: '',
  isPriceExcludeVat: true,
  priceTier: 0,
  adjustment: 0,
  adjustmentLabel: 'Adjustment',
  subTotal: 0,
  netAmount: 0,
  amountBeforeVat: 0,
  taxAmount: 0,
  grandTotal: 0,
  baseVatAmount: 0,
  salesOrderItemResource: []
});
const cm = ref();
const selectedProduct = ref();
const focusedRowIndex = ref<number | null>(null);
const onFieldFocus = (index: number) => {
  focusedRowIndex.value = index;
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

const onSelectPaymentTerm = () => {

  salesOrderSave.value.paymentTerm = selectPaymentTerm.value || null;
  if (salesOrderSave.value.paymentTerm) {
    const selectedTermDays = salesOrderSave.value.paymentTerm.term || 0;

    // Update dueDate by adding the term days to the current date
    const newDueDate = new Date(); // Create a new Date instance (or use an existing one)
    newDueDate.setDate(newDueDate.getDate() + selectedTermDays);

    salesOrderSave.value.dueDate = newDueDate;
  }
}

const itemSelecChange = (event: SalesOrderItemResource, index: number) => {
  fetchLoading.value = true;
  subscription = ItemService.getitemByItemID(event.itemId).subscribe({
    next: (result) => {
      if (result.isSuccess) {

        salesOrderSave.value.salesOrderItemResource[index].itemId = result.data.itemId;
        salesOrderSave.value.salesOrderItemResource[index].itemCode = result.data.itemCode;
        salesOrderSave.value.salesOrderItemResource[index].itemName = result.data.itemName;
        salesOrderSave.value.salesOrderItemResource[index].availableQty = result.data.availableQty;
        salesOrderSave.value.salesOrderItemResource[index].unitPrice = result.data.unitPrice;
        getUOMByItemId(event.itemId, index);
        getTaxList(0, index);
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

const getTaxList = (taxId: number, index: number) => {
  subscription = taxService.getTaxList(taxId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.salesOrderItemResource[index].DDLTAX = result.data;
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    }
  })
}

const getUOMByItemId = (itemId: number, index: number) => {
  subscription = ItemService.getUOMByItemId(itemId).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.salesOrderItemResource[index].DDLUOM = result.data;
        console.log(salesOrderSave.value.salesOrderItemResource[index].DDLUOM);
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
  salesOrderSave.value.salesOrderItemResource.splice(index, 1);
  toast.add({ severity: 'error', summary: 'Row Deleted', detail: `Line ${index + 1}`, life: 3000 });
  selectedProduct.value = null;
};

const onRowReorder = (event: DataTableRowReorderEvent) => {
  salesOrderSave.value.salesOrderItemResource = event.value;
};

const onSelectCustomer = (event: SelectItem) => {
  fetchLoading.value = true;
  subscription = CustomerService.getCustomerById(parseInt(event.code)).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        if (salesOrderSave.value) {
          salesOrderSave.value.customer = result.data;
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

const getPaymentTermList = async () => {
  fetchLoading.value = true;
  subscription = PaymentTermService.getPaymentTermList(0).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlPaymentTerm.value = result.data;
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
          const customer = salesOrderSave.value.customer
          const paymentTerm = salesOrderSave.value.paymentTerm

          if (customer) {
            getCustomerList(customer.customerName);

            let selectDDL: SelectItem = {
              code: customer.customerId.toString(),
              name: customer.customerName
            };
            selectCustomer.value = selectDDL ?? {} as SelectItem;
          }

          if (paymentTerm) {
            getPaymentTermList();
            selectPaymentTerm.value = paymentTerm;
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
    warehouseID: selectWarehouse == null ? 0 : parseInt(selectWarehouse.value?.code ?? '0')
  };

  subscription = ItemService.getitemFilter(search).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        salesOrderSave.value.salesOrderItemResource[rowIndex].DDLItem = result.data;
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

const CloneWarehouseDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.warehouseName == "" ? "--All--" : option.warehouseName,
    code: option.warehouseID == 0 ? "0" : option.warehouseId.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneCustomerDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.customerName == "" ? "--All--" : option.customerName,
    code: option.customerId == 0 ? "0" : option.customerID.toString(),
  }));

  return data.length > 0 ? data : [];
}

const CloneUserDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.firstName == "" ? "--All--" : option.firstName + ' ' + option.lastName,
    code: option.email == "" ? "0" : option.email,
  }));

  return data.length > 0 ? data : [];
}

const addRow = () => {
  let soItem: SalesOrderItemResource = {
    salesOrderItemId: 0,
    salesOrderNumber: '',
    companyId: 0,
    lineNumber: 0,
    itemId: 0,
    itemCode: '',
    itemName: '',
    deliveryDate: new Date(),
    unitCost: 0,
    baseUnitPrice: 0,
    unitPrice: 0,
    availableQty: 0,
    orderQty: 0,
    unit: '',
    unitId: 0,
    baseUnit: '',
    baseUnitId: 0,
    conversionQty: 0,
    baseUnitQty: 0,
    discountRate: '',
    discountAmount: 0,
    taxId: 0,
    taxCode: '',
    taxRate: 0,
    taxAmount: 0,
    lineTotal: 0,
    description: '',
    image: '',
    shippedQty: 0,
    shippedAmount: 0,
    balanceQty: 0,
    balanceAmount: 0,
    parentLineId: 0,
    freeItemFlag: false,
    trackStock: false,
    discountRateMode: false,
    SelectItem: {},
    SelectUOM: {},
    SelectTax: {},
    DDLItem: [],
    DDLUOM: [],
    DDLTAX: []
  };

  salesOrderSave.value.salesOrderItemResource.push(soItem);
}

const SaveSalesOrder = () => {
  console.log(salesOrderSave.value);
  subscription = salesorderService.saveSalesOrder(salesOrderSave.value).subscribe({
    next: (result) => {
      if (result.isSuccess) {

        router.push({ name: 'SalesOrderDetail', params: result.data })
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
  const quantity = data.orderQty || 0;
  const unitPrice = data.unitPrice || 0;
  data.taxCode = data.SelectTax.taxCode;
  data.taxId = data.SelectTax.taxId || 0;
  data.taxRate = data.SelectTax.value || 0;
  data.lineTotal = quantity * unitPrice;

  if (data.discountRateMode) {
    const discountPercentage = parseFloat(data.discountRate) || 0;
    data.discountAmount = data.lineTotal * (discountPercentage / 100);
  } else {
    data.discountAmount = parseFloat(data.discountRate as string) || 0;
  }

  data.lineTotal = data.lineTotal - data.discountAmount;
  data.taxAmount = (salesOrderSave.value.isPriceExcludeVat
    ? data.lineTotal
    : (data.lineTotal * 100) / (100 + data.taxRate)) *
    (data.taxRate / 100);
};

const calculateFooter = computed(() => {
  debugger
  const salesOrder = salesOrderSave.value;
  let subtotal = salesOrder?.salesOrderItemResource?.reduce((sum, item) => sum + item.lineTotal, 0) || 0;
  let netAmount = 0;
  let taxAmount = 0;
  let baseVatAmount = 0;
  let grandTotal = 0;

  if (subtotal > 0) {
    // Calculate discount rate based on either discountRate or discountAmount
    const discRate = salesOrder.discountRate > 0
      ? salesOrder.discountRate
      : (salesOrder.discountAmount > 0
        ? (salesOrder.discountAmount / subtotal) * 100
        : 0);

    // Calculate the amount before VAT (items without taxRate)
    netAmount = subtotal - salesOrder.discountAmount;

    // Calculate total taxAmount
    taxAmount = salesOrder.salesOrderItemResource.reduce((sum, item) => sum + item.taxAmount, 0) || 0;

    // Calculate base VAT amount
    baseVatAmount = salesOrder.salesOrderItemResource.reduce((sum, item) => sum + (item.taxRate > 0
      ? (salesOrder.isPriceExcludeVat ? item.lineTotal : item.lineTotal * 100 / (100 + item.taxRate))
      : 0), 0) || 0;

    // Apply discount rate to VAT and tax amounts
    baseVatAmount *= (1 - discRate / 100);
    taxAmount *= (1 - discRate / 100);

    // Calculate grandTotal considering whether price includes VAT
    grandTotal = subtotal
      + (salesOrder.otherCharges || 0)
      - salesOrder.discountAmount
      + (salesOrder.isPriceExcludeVat ? taxAmount : 0);

    // Set computed values back to salesOrder object
    salesOrder.subTotal = subtotal;
    salesOrder.baseVatAmount = baseVatAmount;
    salesOrder.netAmount = netAmount;// Updated this part
    salesOrder.taxAmount = taxAmount;
    salesOrder.grandTotal = grandTotal;
  }

  return {
    subtotal,
    netAmount,
    taxAmount,
    grandTotal,
    baseVatAmount
  };
});


const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
};

const convertToBuddhistEra = (date: Date): Date => {
  const beYear = date.getFullYear() + 543;
  return new Date(beYear, date.getMonth(), date.getDate());
};

onUnmounted(() => {
  if (subscription)
    subscription.unsubscribe();

  setStickyButtons([]);

})
onMounted(() => {
  salesOrderSave.value.salesOrderNumber = "-- ออกโดยระบบ --";
  getPaymentTermList();
  getPIC('');
  getWarehouseList();
  if (SalesOrderNo != '') {
    fetchData()
  } else {
    for (let index = 0; index < 3; index++) {
      addRow();
    }
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