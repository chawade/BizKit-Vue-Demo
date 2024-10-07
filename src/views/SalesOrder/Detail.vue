<template>
  <div v-if="loading" class="justify-center"
    style="width: 100%; height: 100%; text-align: center; vertical-align: middle;">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="card">
      <div class="row mb-8 w-full">
        <Menubar :model="filteredMenuItems" class="hidden md:flex">
          <template #end>
            <router-link to="/SalesOrder/Maintain/">
              <Button icon="pi pi-plus-circle" label="Create Sales Order" severity="success" />
            </router-link>
          </template>
        </Menubar>
      </div>
      <div class="detail-head flex justify-between items-end mb-8">
        <div>
          <h1 class="uppercase font-semibold text-l text-left" style="bottom: 0;">
            <span>Sales Order Detail</span>
          </h1>
        </div>

        <div class="text-right">
          <div class="font-bold text-2xl">{{ salesOrder?.SalesOrderNumber }}</div>
          <Tag :value="salesOrder?.Status.StatusName" :style="{
            border: salesOrder?.Status.StatusBorderColor, backgroundColor: salesOrder?.Status.StatusBgColor,
            color: salesOrder?.Status.StatusFontColor, fontSize: salesOrder?.Status.StatusFontSize
          }" />
        </div>
      </div>

      <div class="flex flex-col gap-x-20 lg:flex-row w-full">
        <!-- Left Card -->
        <div class="flex flex-col w-full lg:w-1/2 gap-4 p-2">
          <Card class="w-full">
            <template #title>
              <div class="portlet-title">
                <div class="caption">
                  <span class="uppercase font-bold" style="font-size: 1.2rem;">Customer</span>
                </div>
              </div>
            </template>
            <template #content>
              <div class="row stattic-info">
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.CustomerName }}</span>
              </div>
              <div class="flex flex-col gap-2 w-full">
                <div class="font-bold text-xl">Billing Info</div>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.BillingAddress1 }} {{
                  salesOrder?.Customer.BillingAddress2 }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.BillingAmphur }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.BillingProvince }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.BillingCountry }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.BillingPostalCode }}</span>
              </div>
              <div class="flex flex-col gap-2">
                <div class="font-bold text-xl">Shipping Info</div>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingAddress1 }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingAddress2 }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingAmphur }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingProvince }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingCountry }}</span>
                <span class="col-sm-6 font-normal">{{ salesOrder?.Customer.ShippingPostalCode }}</span>
              </div>
            </template>
          </Card>
        </div>

        <!-- Right Card -->
        <div class="flex flex-col w-full lg:w-1/2 gap-4 p-2">
          <Card class="w-full">
            <template #title>
              <div class="portlet-title">
                <div class="caption">
                  <span class="uppercase font-bold" style="font-size: 1.2rem;">Sales Order Info</span>
                </div>
              </div>
            </template>
            <template #content>
              <div class="flex flex-col">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="SalesOrderDate">Sales order date</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.SalesOrderDate }}</span>
                </div>

                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="SONo">Delivery Date</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.DeliveryDate }}</span>
                </div>

                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField1">Payment Term</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.PaymentTermDescription }}</span>
                </div>

                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField2">Due Date</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.DueDate }}</span>
                </div>

                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField3">Warehouse</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.WarehouseName }}</span>
                </div>
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField3">Person in charge</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.PersonInCharge }}</span>
                </div>
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField3">Reference No.</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.ReferenceNo }}</span>
                </div>
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField3">Skip Pick & Ship</label>
                  <Checkbox v-model="SkipPick" binary disabled class="mt-1 lg:mt-0 lg:ml-2 flex-grow" />
                </div>
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-center mt-2 lg:ml-2 xl:ml-5 xl:w-full">
                  <label class="font-bold mb-1 lg:mb-1 lg:w-1/3" for="AdditionalField3">Subject</label>
                  <span class="mt-1 lg:mt-0 lg:ml-2 flex-grow">{{ salesOrder?.Subject }}</span>
                </div>
              </div>
            </template>

          </Card>
        </div>
      </div>

      <div class="card">
        <Suspense>
          <Tabs v-if="!loading && salesOrder" :lazy="true" v-model:value="activeIndex" @update:value="handleTabChange">
            <TabList>
              <Tab value="1">Order</Tab>
              <Tab value="2">Pick</Tab>
              <Tab value="3">Ship</Tab>
            </TabList>
            <TabPanel :lazy="true" value="1" header="Order">
              <div class="row invoice-body mb-8">
                <div class="col-xs-12 table-wrapper">
                  <DataTable :value="salesOrder.SalesOrderItems" tableStyle="min-width: 50rem">
                    <Column field="LineNumber" header="No."></Column>
                    <Column field="ItemCode" header="Item Code"></Column>
                    <Column field="DeliveryDate" header="Delivery Date"></Column>
                    <Column field="OrderQty" header="Order Qty"></Column>
                    <Column field="Unit" header="Unit"></Column>
                    <Column field="UnitPrice" header="Unit Price"></Column>
                  </DataTable>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="2" header="Pick" :lazy="true">
              <Card class="w-full">
                <template #title>
                  <div class="portlet-title">
                    <div class="caption">
                      <Menubar :model="menuPicking" class="mb-5">
                        <template #end>
                          <div class="flex items-center gap-2">
                            <Tag :value="salesOrder?.Status.StatusName" :style="{
                            border: salesOrder?.Status.StatusBorderColor, backgroundColor: salesOrder?.Status.StatusBgColor,
                            color: salesOrder?.Status.StatusFontColor, fontSize: salesOrder?.Status.StatusFontSize
                          }" />
                          </div>
                        </template>
                      </Menubar>
                      <span class="uppercase font-bold" style="font-size: 1.2rem;">Picking Item</span>
                    </div>
                  </div>
                </template>
                <template #content>
                  <DataTable v-model:expandedRowGroups="expandedRowGroups" v-model:selection="selectedItems"
                    :value="pickItems" :rows="10" dataKey="PickingID" :loading="fetchLoading" :lazy="true" :totalRecords="totalRecords"
                    :rowsPerPageOptions="[5, 10, 25]" scrollable :paginator="true" @row-select="onRowSelect"
                    @row-unselect="onRowUnselect" @page="onPageChange" expandableRowGroups rowGroupMode="subheader"
                    groupRowsBy="ItemCode" @rowgroup-expand="onRowGroupExpand" @rowgroup-collapse="onRowGroupCollapse"
                    sortMode="single" sortField="ItemCode" :sortOrder="1" tableStyle="width: 100%">
                    <template #groupheader="slotProps">
                      <span class="align-middle ml-2 font-bold leading-normal"> {{ slotProps.data.ItemCode }} - {{
                        slotProps.data.Description }}</span>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem" style="width: 5%"></Column>
                    <Column field="LineNumber" header="Line No." style="width: 10%">
                      <template #body="slotProps">
                        {{ (slotProps.index + 1) }} <!-- Adjusting the index to start from 1 -->
                      </template>
                    </Column>
                    <Column field="LotNo" header="Lot No." style="width: 15%"></Column>
                    <Column field="WarehouseName" header="Warehouse" style="width: 20%"></Column>
                    <Column field="ShelfCode" header="Shelf" style="width: 15%"></Column>
                    <Column field="Available" header="Available Qty" style="width: 15%"></Column>
                    <Column field="PickedQty" header="Picked Qty" style="width: 15%"></Column>
                    <Column field="StatusName" header="Status" style="width: 10%">
                      <template #body="slotProps">
                        <span :style="{
                        backgroundColor: slotProps.data.StatusBgColor,
                        color: slotProps.data.StatusFontColor,
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontSize: `${slotProps.data.StatusFontSize}px`
                      }">
                          {{ slotProps.data.StatusName }}
                        </span>
                      </template>
                    </Column>
                    <template #empty>
                      <div class="p-text-center p-m-4">
                        <Tag style="width: 100%; min-height: 70px" severity="secondary" value="No records available">
                        </Tag>
                      </div>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </TabPanel>
            <TabPanel value="3" header="Ship" :lazy="true">
              <p class="m-0">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
                eligendi optio cumque nihil impedit quo minus.
              </p>
            </TabPanel>
          </Tabs>
        </Suspense>

      </div>

      <div class="flex flex-col w-full">
        <Card class="w-full">
          <template #title>
            <div class="portlet-title">
              <div class="caption">
                <span class="uppercase font-bold" style="font-size: 1.2rem;">Picking & Shipping History</span>
              </div>
            </div>
          </template>
          <template #content>
            <DataTable :value="History" tableStyle="min-width: 50rem">
              <Column field="LineNumber" header="No."></Column>
              <Column field="PickingNo" header="Picking No.">
                <template #body="{ data }">
                  <Button :label="data.PickingNo" link @click="pickingNo = data.PickingNo; activeIndex = '2'; loadPickData()"
                    class="p-0" />
                </template>
              </Column>
              <Column field="ShippingNo" header="Shipping No.">
                <template #body="{ data }">
                  <Button :label="data.ShippingNo" link @click="shippingNo = data.ShippingNo" class="p-0" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Activity History section can be added here -->

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SalesOrderService from '@/Service/salesorderService';
import type { SalesOrderResource } from '@/Model/SalesOrder';
import type { PikcingSearch } from '@/Model/Picking';
import { useToast } from 'primevue/usetoast';

const salesOrder = ref<SalesOrderResource>();
const selectedTakingIds = ref<number[]>([]);
const selectedItems = ref([]);
const toast = useToast();
const loading = ref(false);
const error = ref('');
const SkipPick = ref(false);
const route = useRoute();
const router = useRouter();
const SalesOrderNo: string = String(route.params.id);
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)
const activeIndex = ref('1');
const pickItems = ref([]);
const fetchLoading = ref(true);
const pickingNo = ref('');
const shippingNo = ref('');
const History = ref([]);
const expandedRowGroups = ref();
const menuPicking = ref([
  {
    label: 'Import Picking',
    icon: 'pi pi-file-import',
    command: () => {
      router.push(`/SalesOrder/Maintain/${salesOrder.value?.SalesOrderId}`)
    }
  },
  {
    label: 'Create Picking',
    icon: 'pi pi-plus-circle',
    command: () => {
      router.push(`/SalesOrder/Maintain/${salesOrder.value?.SalesOrderId}`)
    }
  }

])

const nestedMenuitems = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      router.push(`/SalesOrder/Maintain/${salesOrder.value?.SalesOrderId}`)
    }
  },
  {
    label: 'Approve',
    icon: 'pi pi-check-circle',
    command: () => {

    }
  },
  {
    label: 'More Action',
    items: [
      {
        label: 'Copy',
        icon: 'pi pi-fw pi-compass'
      },
      {
        label: 'Cancel',
        icon: 'pi pi-fw pi-map-marker'
      },
      {
        label: 'Manage',
        icon: 'pi pi-fw pi-pencil'
      }
    ]
  },
  {
    label: 'Back',
    icon: 'pi pi-arrow-left',
    command: () => {
      router.push({ name: 'SalesOrder' })
    }
  }
]);
const onRowGroupExpand = (event: any) => {
  toast.add({ severity: 'info', summary: 'Row Group Expanded', detail: 'Value: ' + event.data, life: 3000 });
};
const onRowGroupCollapse = (event: any) => {
  toast.add({ severity: 'success', summary: 'Row Group Collapsed', detail: 'Value: ' + event.data, life: 3000 });
};
const onPageChange = (event: { first: number, rows: number, page: number }) => {
  // Update state   
  currentPage.value = event.page + 1;
  pageSize.value = event.rows;
  // Handle data loading for the new page (pagination)
  loadPickData();
}

const filteredMenuItems = computed(() => {
  return nestedMenuitems.value.filter(item => {
    if (item.label === 'Approve') {
      return salesOrder.value?.Status.StatusId === 100; // Show "Approve" only if status is 100
    }
    return true; // Show other items regardless of status
  });
});

const handleTabChange = (index: number) => {
  debugger
  console.log('Tab changed to:', index);
  if (index == 2) {
    loadPickData();
  }
};

const loadPickData = async () => {
  try {
    debugger
    if (pickingNo.value === '')
      return
    console.log(pickingNo.value);
    fetchLoading.value = true;
    const search: PikcingSearch = {
      SONo: SalesOrderNo,
      pickingNo: pickingNo.value,
      pageIndex: currentPage.value,
      pageSize: pageSize.value
    };

    const response = await SalesOrderService.getPikcing(search);
    pickItems.value = response.Data;
    totalRecords.value = response.Pagination?.TotalRecords ?? 0;
    totalPages.value = response.Pagination?.TotalPages ?? 0;
  } catch (error) {
    console.error('Error fetching picking list:', error);
    // Handle error (e.g., show error message to user)
  }finally{
    fetchLoading.value = false;
  }
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await SalesOrderService.get(SalesOrderNo);
    const pickShipHistory = await SalesOrderService.getPickShipHistory(SalesOrderNo);
    console.log(pickShipHistory.Data)
    History.value = pickShipHistory.Data;
    salesOrder.value = response.Data as SalesOrderResource;
    SkipPick.value = salesOrder.value.SkipPicking;
  } catch (err: any) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const onRowSelect = (event: any) => {
  const takingId = event.data.TakingId;
  if (!selectedTakingIds.value.includes(takingId)) {
    selectedTakingIds.value.push(takingId);
  }
};

const onRowUnselect = (event: any) => {
  const takingId = event.data.TakingId;
  const index = selectedTakingIds.value.indexOf(takingId);
  if (index > -1) {
    selectedTakingIds.value.splice(index, 1);
  }
  console.log('Selected TakingIds:', selectedTakingIds.value);
  return selectedTakingIds.value;
};

const savePlan = () => {
  console.log('Save plan');
};

// const approve = async () => {
//   console.log('Approved');
//   try {
//     loading.value = true;
//     await StockTakingService.approve(`/${SalesOrderNo}`, [SalesOrderNo]);
//     fetchData();
//   } catch (err: any) {
//     error.value = `Failed to fetch stock taking data: ${err.message}`;
//     loading.value = false;
//   }
// };

// const cancelApprove = async () => {
//   console.log("Cancel approve!");
//   try {
//     loading.value = true;
//     await StockTakingService.cancelApprove(`/${SalesOrderNo}`, [SalesOrderNo]);
//     fetchData();
//   } catch (err: any) {
//     error.value = `Failed to fetch stock taking data: ${err.message}`;
//   }
// };

// const cancel = async () => {
//   console.log("Cancel!");
//   try {
//     loading.value = true;
//     await StockTakingService.cancel(`/${SalesOrderNo}`, [SalesOrderNo]);
//     fetchData();
//   } catch (err: any) {
//     error.value = `Failed to fetch stock taking data: ${err.message}`;
//   }
// };

const editStock = () => {
  console.log('Edit');
  router.push(`/StockTaking/Maintain/${SalesOrderNo}`);
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

onMounted(() => {
  fetchData()
})
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
