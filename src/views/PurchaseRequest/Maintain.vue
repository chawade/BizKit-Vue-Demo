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
                            <InputText v-model="purchaseRequestSave.purchaseRequestNo" variant="filled"
                              readonly="true" />
                            <Button icon="pi pi-cog" severity="help" @click="" />
                          </InputGroup>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Plan Ship Date"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Vendor</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectVendor" :options="ddlVendor" :loading="fetchLoading"
                            placeholder="Select a Vendor" @update:model-value="onSelectVendor"
                            @change="handleVendor"
                            optionLabel="vendorName" dataKey="termId" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Payment Term"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Lead
                          Time (Day)</label>
                        <div class="col-span-12 md:col-span-8">
                          <InputText id="name3" type="text" disabled placeholder="" v-model="selectLeadtime"/>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="PIC"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">PIC</label>
                          <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectPIC" :options="ddlPIC" :loading="fetchLoading"
                            placeholder="Select a PIC" optionLabel="name" dataKey="code">
                            <template #option="slotProps">
                              <div class="flex flex-col gap-2">
                                <label for="username">{{ slotProps.option.name }}</label>
                                <!-- <small id="username-help">{{ slotProps.option.code }}</small> -->
                              </div>
                            </template>
                          </SelectCustom>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Shipping
                          Address</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectCompanyAddress" :options="ddlCompanyAddress" :loading="fetchLoading"
                            placeholder="Select a Address" optionLabel="name" dataKey="code" @update:modelValue="onSelectCompanyAddress">
                            <template #option="slotProps">
                              <div class="flex flex-col gap-2">
                                <label for="Addressname">{{ slotProps.option.name }}</label>
                                <label for="fullname">{{ slotProps.option.fullAddress }}</label>
                              </div>
                            </template>
                          </SelectCustom>
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
                          <DatePicker v-model="purchaseRequestSave.dueDate" variant="filled" showButtonBar showIcon
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
                          <DatePicker v-model="purchaseRequestSave.deliveryDate" variant="filled" showButtonBar showIcon
                            fluid :manual-input="false" />
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Project"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Project</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectProject" :options="ddlProject" :loading="fetchLoading"
                            placeholder="Select a Project" optionLabel="name" dataKey="code" @update:model-value="onSelectProject">
                            <template #option="slotProps">
                              <div class="flex flex-col gap-2">
                                <label for="projectname">{{ slotProps.option.name }}</label>
                              </div>
                            </template>
                          </SelectCustom>
                        </div>
                      </div>
                      <div class="grid grid-cols-12 gap-2">
                        <label for="Ship From"
                          class="flex items-center col-span-12 font-semibold text-lg mb-2 md:col-span-4 md:mb-0">Department</label>
                        <div class="col-span-12 md:col-span-8">
                          <SelectCustom v-model="selectDepartment" :options="ddlDepartment" :loading="fetchLoading"
                            placeholder="Select a Department" optionLabel="name" dataKey="code" @update:model-value="onSelectDepartment">
                            <template #option="slotProps">
                              <div class="flex flex-col gap-2">
                                <label for="departname">{{ slotProps.option.name }}</label>
                              </div>
                            </template>
                          </SelectCustom>
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
import type { SalesOrderItemResource as SalesOrderResource, SalesOrderSaveResource as PurchaseRequestSaveResource, SalesOrderSearch } from '@/Model/SalesOrder';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import SelectCustom from '@/components/SelectCustom.vue';
import PriceList from '@/Model/GlobalVariable/PriceList'
import paymentTermService from '@/service/paymentTermService';
import warehouseService from '@/service/warehouseService';
import type { SelectItem } from '@/Model/BaseResource';
import router from '@/router';
import ItemService from '@/service/ItemService';
import type { PurchaseRequestSave as PurchaseRequestItem, PurchaseRequestItemResource, PurchaseRequestSave } from '@/Model/purchaseRequest';
import PurchaseRequestService from '@/Service/purchaseRequestService';
import type { VendorListResource, VendorResource } from '@/Model/vendor';
import vendorService from '@/Service/vendorService';
import userService from '@/service/userService';
import projectService from '@/Service/projectService';
import type { ProjectListResource } from '@/Model/project';
import departmentService from '@/Service/departmentService';
import type { DepartmentListResource } from '@/Model/department';
import customerService from '@/service/customerService';
import companyProfileService from '@/Service/companyProfileService';

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
const ddlPrice = new PriceList().getPriceList();
const pageNumber = ref(1)
const pageSize = ref(0)
const searchString = ref('')
const direction = ref('DESC')
const sortKey = ref('CustomerName')
const totalRecords = ref(0)
const vendorId = ref(0)
const search = ref('')
const addressId = ref(0)

const route = useRoute();
const PurchaseRequestNo: string = String(route.params.no);
const ddlDepartment = ref<SelectItem[]>([]);
const ddlVendor = ref<VendorResource[]>([]);
const ddlWarehouse = ref<SelectItem[]>([]);
const ddlItem = ref<SelectItem[]>([]);
const ddlPIC = ref<SelectItem[]>([]);
const ddlProject = ref<SelectItem[]>([]);
const ddlCompanyAddress = ref<SelectItem[]>([]);

const fetchLoading = ref(false); 

const selectLeadtime =ref();
const selectVendorId = 0;
const selectCompanyAddress = ref<SelectItem | null>();
const selectProject = ref<ProjectListResource | null>();
const selectPIC = ref<SelectItem | null>();
const selectDepartment = ref<DepartmentListResource | null>();
const selectVendor = ref<VendorResource | null>();
const selectWarehouse = ref<SelectItem | null>();
const selectItem = ref<SelectItem | null>();

const purchaseRequestItem = ref<PurchaseRequestItemResource[]>([]);
const purchaseRequestSave = ref<PurchaseRequestSave>({
  purchaseRequestNo: '',
  companyId: 0,
  purchaseRequestDate: new Date,
  termDescription: '',
  referenceNo: '',
  paymentTerm: null,
  vendor: null,
  statusId: 0,
  deliveryDate: new Date,
  dueDate: new Date,
  deliveryAddress1: '',
  deliveryAddress2: '',
  deliveryCity: '',
  deliveryState: '',
  deliveryZipCode: '',
  deliveryCountry: '',
  personInCharge: '',
  currency: '',
  exchangeRate: 0,
  taxAmount: 0,
  discountRate: 0,
  discountAmount: 0,
  otherCharges: 0,
  subtotal: 0,
  notes: '',
  termAndConditions: '',
  templateId: 0,
  totalAmount: 0,
  purchaseRequestItems: [],
  userId: '',
  ipAddress: '',
  url: '',
  project: null,
  department: null,
  customer: null,
  ddlItem: []
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

const onSelectVendor = () => {
  debugger
  purchaseRequestSave.value.vendor = selectVendor.value || null;
  if (purchaseRequestSave.value.vendor) { 
  }
}
const getLeadTimeByVendorId = async () =>{
  fetchLoading.value = true;
  const endpoint = vendorId.value;
  subscription = vendorService.get(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlVendor.value = result.data;
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
      console.log(result, 'venlead')
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const getVendorList = async (vendorName: string) =>{
  fetchLoading.value = true;
  const endpoint = `${pageNumber.value}/${pageSize.value}/${direction.value}/${searchString.value}`;
  subscription = vendorService.getlist(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlVendor.value = result.data;
      } else {
        toast.add({ severity: 'error', summary: result.statusCode.toString(), detail: result.error?.message, life: 2000 });
      }
      console.log(result, 'result')
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};
// Modify the onRowContextMenu function to include index
const onRowContextMenu = (event: any) => {
  selectedProduct.value = event;
  cm.value.show(event.originalEvent);
};

const handleVendor = () => {
  vendorId.value = selectVendor.value ? Number(selectVendor.value.vendorId) : 0;
  getLeadTimeByVendorId();
  // console.log('vendor on change: ',selectVendor.value)
}
// Modify the deleteProduct function to use the index
const deleteProduct = (data: PurchaseRequestItem, index: number) => {
  purchaseRequestSave.value.purchaseRequestItems.splice(index, 1);
  toast.add({ severity: 'error', summary: 'Row Deleted', detail: `Line ${index + 1}`, life: 3000 });
  selectedProduct.value = null;
};

const fetchData = async () => {
  debugger
  fetchLoading.value = true;
  subscription = PurchaseRequestService.get(PurchaseRequestNo).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        purchaseRequestSave.value = result.data;
        if (purchaseRequestSave.value) {
          const vendor = purchaseRequestSave.value.vendor;

          if (vendor) {
            getVendorList(vendor.vendorName);
            if (selectVendor.value && vendor.vendorName) {
              selectVendor.value.vendorName = vendor.vendorName; 
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
const onSelectCompanyAddress = (event: SelectItem) => {
  fetchLoading.value = true;
  subscription = companyProfileService.getList('').subscribe({
    next: (result) => {
      if (result.isSuccess) {
        if (purchaseRequestSave.value) {
          purchaseRequestSave.value.companyId = result.data;
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
const getCompanyAddressList = async (event: string) => {
  searchString.value = event;
  const endpoint = addressId.value;
  fetchLoading.value = true;
  subscription = companyProfileService.getList(String(endpoint)).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        ddlCompanyAddress.value = CloneCompanyAddressDDL(result.data || []);
        console.log(result.data)
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
const onSelectProject = () => {
  debugger
  purchaseRequestSave.value.project = selectProject.value || null;
  if (purchaseRequestSave.value.project) { 
  }
}
const onSelectDepartment = () => {
  debugger
  purchaseRequestSave.value.department = selectDepartment.value || null;
  if (purchaseRequestSave.value.department) { 
  }
}
const getDepartment = async (name: string) => {
  fetchLoading.value = true;
  const endpoint = `${searchString.value}`;
  subscription = departmentService.getList(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        debugger
        ddlDepartment.value = CloneDepartmentDDL(result.data || []);

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
const getProject = async (name: string) => {
  fetchLoading.value = true;
  const endpoint = `${searchString.value}`;
  subscription = projectService.getProjectList(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        debugger
        ddlProject.value = CloneProjectDDL(result.data || []);

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
const CloneDepartmentDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.nameEN,
    code: option.departmetId == "" ? "0" : option.departmetId,
  }));

  return data.length > 0 ? data : [];
}
const CloneProjectDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.projectNameTh,
    code: option.projectId == "" ? "0" : option.projectId,
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
const getWarehouseList = async () => {
  fetchLoading.value = true;
  subscription = warehouseService.getWarehouseList().subscribe({
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


const getItemList = async (event: string, rowIndex: number) => {
  fetchLoading.value = true;
  searchString.value = event;
  const endpoint = `${pageNumber.value}/${pageSize.value}/${direction.value}/${searchString.value}`;
  subscription = ItemService.getitemList(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        purchaseRequestItem.value[rowIndex].ddlItem = CloneItemDDL(result.data || []);
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

const CloneCompanyAddressDDL = (options: Array<any>): Array<SelectItem> => {
  const data = options.map((option) => ({
    name: option.addressLine1 == "" ? "--All--" : (option.addressLine1 || "") + "\n" +
                 (option.addressLine2 == null ? "" : (option.addressLine2 + "\n")) +
                 (option.city || "") + " " +
                 (option.state || "") + " " +
                 (option.countryName == null ? "" : option.countryName) + " " +
                 (option.postalCode || ""),
    code: option.companyAddressID == 0 ? "0" : option.companyAddressID,
  }));
console.log(data, "CloneCompanyAddressDDL");
  return data.length > 0 ? data : [];
}

const addRow = () => {
  let prItem: PurchaseRequestItemResource = {
    purchaseRequestNo: ' ',
    companyId: 0,
    lineNumber: 0,
    itemId: 0,
    itemCode: '',
    description: '',
    requiredDate: '',
    orderQuantity: 0,
    unit: '',
    unitCost: 0,
    discountRate: 0,
    discountAmount: 0,
    vatId: 0,
    vatCode: '',
    vatRate: 0,
    vatAmount: 0,
    lineTotal: 0,
    purchaseOrderNo: '',
    referenceNo: '',
    referenceLineNumber: 0,
    ddlItem: [],
    purchaseRequestItem: [],
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
  purchaseRequestSave.value.purchaseRequestNo = "-- Auto Numbering --";
    getVendorList('');
    getPIC('');
    getProject('');
    getDepartment('');
    getCompanyAddressList('');
    getLeadTimeByVendorId();
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