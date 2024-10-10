<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="card">
      <!-- Header Section -->
      <div class="col-sm-8 flex justify-between mb-8">
        <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Purchase Request List
        </h4>
        <router-link to="/PurchaseRequest/PRMaintain">
          <Button icon="pi pi-plus-circle" label="New Purchase Request" severity="success" />
        </router-link>
        <!-- <div v-if="permission.MODIFY">
          <Button icon="pi pi-plus-circle" label="New Purchase Request" severity="success" @click="NewPR" />
        </div> -->
      </div>

      <!-- Search Section -->
      <div class="row">
        <div class="col-sm-8 mb-5">
          <div v-if="permission.EXPORT" class="grid gap-2" role="group">
            <div class="col-span-full lg:col-span-8 flex flex-wrap gap-2">
              <Button label="Approve" severity="success" class="w-full sm:w-auto" @click="Approve" />
              <Button label="ExportCSV" severity="info" class="w-full sm:w-auto" @click="exportToCSV" />
              <Button label="ExportExcel" severity="info" class="w-full sm:w-auto" @click="exportToExcel" />
            </div>
            <div class="col-span-full lg:col-span-2 mt-2 lg:mt-0 lg:col-start-9">
              <span class="p-input-icon-right w-full">
                <InputGroup>
                  <InputText v-model="searchString" class="w-full" placeholder="Request No., Vendor Name, Status" />
                  <Button icon="pi pi-search" severity="info" @click="searchList" />
                  <Button icon="pi pi-bars" class="p-button-text" severity="info"
                    v-styleclass="{ selector: '#searchDetail', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }" />
                </InputGroup>
              </span>
            </div>
          </div>
        </div>
        <div id="searchDetail"
          class="config-panel hidden right-0 w-full p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]">
          <div class="lg:w-3/3 border-b-1 rounded-md shadow p-5">
            <form @submit.prevent="submitForm">
              <!-- First row -->
              <div class="flex flex-col lg:flex-row lg:justify-center">
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">PR No.</label>
                    <InputText id="username" aria-describedby="username-help" placeholder="PR No." />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Vendor</label>
                    <Select v-model="selectedVendor" optionLabel="name" placeholder="Select" class="w-full" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Status</label>
                    <Select v-model="selectedStatus" optionLabel="name" placeholder="Select" class="w-full" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Reference No.</label>
                    <InputText id="username" aria-describedby="username-help" placeholder="Reference No." />
                  </div>
                </div>
              </div>

              <!-- Second row -->
              <div class="flex flex-col mt-4 lg:flex-row lg:justify-center">
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Remark</label>
                    <InputText id="username" aria-describedby="username-help" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Item Code</label>
                    <InputText id="username" aria-describedby="username-help" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Item Name</label>
                    <InputText id="username" aria-describedby="username-help" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex gap-2 w-full">
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountFrom">Amount From</label>
                      <InputText id="amountFrom" aria-describedby="amountFrom-help" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountTo">To</label>
                      <InputText id="amountTo" aria-describedby="amountTo-help" class="w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Third row -->
              <div class="flex flex-col mt-4 lg:flex-row lg:justify-center">
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">PR Date</label>
                    <Select v-model="selectedPRDate" optionLabel="name" placeholder="Select" class="w-full" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex gap-2 w-full">
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountFrom">From</label>
                      <InputText id="amountFrom" aria-describedby="amountFrom-help" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountTo">To</label>
                      <InputText id="amountTo" aria-describedby="amountTo-help" class="w-full" />
                    </div>
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex flex-col gap-2">
                    <label class="font-bold" for="PRNo">Require Date</label>
                    <Select v-model="selectedRequireDate" optionLabel="name" placeholder="Select" class="w-full" />
                  </div>
                </div>
                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                  <div class="flex gap-2 w-full">
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountFrom">From</label>
                      <InputText id="amountFrom" aria-describedby="amountFrom-help" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 w-1/2">
                      <label class="font-bold" for="amountTo">To</label>
                      <InputText id="amountTo" aria-describedby="amountTo-help" class="w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                <Button label="Detail Search" severity="info" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-scrollable table-list">
        <DataTable v-model:selection="selectedItems" :value="request" :rows="10" dataKey="PurchaseRequestNo"
          :paginator="true" :rowsPerPageOptions="[5, 10, 25]" scrollable scrollHeight="400px"
          tableStyle="min-width: 50rem" @row-select="onRowSelect" @row-unselect="onRowUnselect">
          <Column header="">
                        <template #body="{ data }">
                            <div class="dropdown" @mouseleave="closeDropdown(data)">
                                <Button icon="pi pi-cog" class="p-button-text" @click="toggleDropdown(data)"
                                    aria-label="Menu" />
                                <div v-if="dropdownVisible[data.PurchaseRequestNo]" class="dropdown-menu">
                                    <ul class="dropdown-list">
                                        <li><router-link :to="`/PurchaseRequest/Detail/${data.PurchaseRequestNo}`">{{ 'Detail'
                                                }}</router-link></li>
                                        <li v-if="permission.MODIFY && data.StatusCode !== TAKING && data.StatusCode < APPROVED"
                                            @click="handleAction(data, 'edit')">{{ 'Edit' }}</li>
                                        <li v-if="permission.MODIFY" @click="handleAction(data, 'copy')">{{ 'Copy' }}
                                        </li>
                                        <li v-if="permission.PRINT && data.StatusCode !== CANCELLED"
                                            @click="handleAction(data, 'print')">{{ 'Print' }}</li>
                                        <li v-if="permission.MODIFY && data.StatusCode < APPROVED"
                                            @click="handleAction(data, 'cancel')" class="text-danger">
                                            <span><i class="fa fa-trash-o"></i> {{ 'Cancel' }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                    </Column>
          <Column selectionMode="multiple" headerStyle="width: 3rem" style="width: 5%"></Column>
          <Column field="PurchaseRequestNo" header="PRNo" sortable>
            <template #body="{ data }">
              <router-link :to="`/PurchaseRequest/Detail/${data.PurchaseRequestNo}`" custom v-slot="{ navigate }">
                <Button :label="data.PurchaseRequestNo" link @click="navigate" class="p-0" />
              </router-link>
            </template>
          </Column>
          <Column field="PurchaseRequestDate" header="PRDate" sortable></Column>
          <Column field="RequireDate" header="RequireDate" sortable></Column>
          <Column field="Vendor.VendorName" header="Vendor" sortable></Column>
          <Column field="Project" header="Project"></Column>
          <Column field="Department" header="Department"></Column>
          <Column field="Amount" header="Amount" sortable class="text-right"></Column>
          <Column field="Status.StatusName" header="Status">
            <template #body="slotProps">
              <span @click="SortBy(slotProps.data.Status.StatusName)" :style="{
                backgroundColor: slotProps.data.Status.StatusBgColor,
                color: slotProps.data.Status.StatusFontColor,
                border: `1px solid ${slotProps.data.Status.StatusBorderColor}`,
                fontSize: `${slotProps.data.Status.StatusFontSize}px`,
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block',
                cursor: 'pointer'
              }">
                {{ slotProps.data.Status.StatusName }}
              </span>
              <i :class="direction === 'asc' ? 'fa fa-sort-asc' : 'fa fa-sort-desc'" style="margin-left: 8px;"></i>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from 'vue';
import PurchaseRequestService from '@/Service/purchaseRequestService';
import type Menu from 'primevue/menu';

interface Vendor {
  VendorId: number;
  CompanyId: number;
  VendorCode: string | null;
  VendorName: string;
}

interface Status {
  StatusId: number;
  StatusName: string;
  LocalStatusName: string | null;
  StatusBgColor: string;
  StatusBorderColor: string;
  StatusFontColor: string;
  StatusFontSize: number;
}

interface PurchaseRequest {
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  VendorName: string;
  Vendor: Vendor | null;
  Project: string;
  Department: string;
  Status: Status;
  Amount: number;
  ReferenceNo: string;
  PRNoSearchPlaceholder: string;
  Remark: string;
  ItemCode: string;
  ItemName: string;
  selectedItems: boolean;
  TotalAmount: number;
}

interface PaginatedData {
  id: number;
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  VendorName: string;
  Project: string;
  Department: string;
  Status: string;
  TotalAmount: number;
  DeliveryDate: string;
  selectedItems: boolean;
}
interface StockTaking {
  StockTakingId: number;
  PRNo: string;
  PRDate: string;
  ReferenceNo: string;
  Remark: string;
  Status: Status;
  ItemCode: string;
  ItemName: string;
  Amount: number;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string | null;
  UpdateDate: string | null;
  VendorId: number;
  VendorName: string;
  Project: string;
  Department: string;
  Search: string;
}
interface CommonResource {
  FromStringResource: string;
  ToStringResource: string;
}
interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  style?: string;
  filterable?: boolean;
  filterField?: string;
}
const dropdownVisible: Ref<Record<string, boolean>> = ref({});
const menu = ref<InstanceType<typeof Menu> | null>(null);
const selectedItems = ref<number[]>([]);
const request = ref<PurchaseRequest[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const totalPages = ref(1);
const totalRecords = ref(0);
const pageNumber = ref(1);
const pageSize = ref(10);
const sortBy = ref('PRDate');
const direction = ref('DESC');
const searchString = ref('');
const vendorList = ref<Vendor[]>([]);
const statusList = ref<Status[]>([]);
const permission = ref({
  APPROVE: true,
  MODIFY: true,
  PRINT: true,
  EXPORT: true
});
const TAKING = 175;
const APPROVED = 200;
const CANCELLED = 2000;

const selectedPurchaseRequestNo = ref<string[]>([]);
const showAlertMsg = ref(false);
const selectedVendor = ref([]);
const selectedStatus = ref([]);
const selectedPRDate = ref([]);
const selectedRequireDate = ref([]);

const fetchPurchaseRequests = async () => {
  try {
    debugger;
    loading.value = true;
    const response = await PurchaseRequestService.getlist(`${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${searchString.value}`)

    request.value = response.Data;
    // console.log(response);
    totalRecords.value = response.Pagination.TotalRecords
    totalPages.value = response.Pagination.TotalPages
  } catch (err: any) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// const menuaa = ref([
//   {
//     label: 'Options',
//     items: [
//       {
//         label: 'Detail',
//         icon: 'pi pi-refresh'
//       },
//       {
//         label: 'Export',
//         icon: 'pi pi-upload'
//       },
//       {
//         label: 'Cancel',
//         icon: 'pi pi-trash'
//       }
//     ]
//   }
// ]);
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};
const onRowSelect = (event: any) => {
  const purchaserequestNo = event.data.TakingId;
  if (!selectedPurchaseRequestNo.value.includes(purchaserequestNo)) {
    selectedPurchaseRequestNo.value.push(purchaserequestNo);
  }
};
const onRowUnselect = (event: any) => {
  const purchaserequestNo = event.data.TakingId;
  const index = selectedPurchaseRequestNo.value.indexOf(purchaserequestNo);
  if (index > -1) {
    purchaserequestNo.value.splice(index, 1);
  }
  console.log('Selected PurchaserequestNo:', purchaserequestNo.value);
  return purchaserequestNo.value;
};


const submitForm = async () => {

}
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    pageNumber.value = page;
    fetchPurchaseRequests();
    console.log(page);
  }
};

const NewPR = () => {
  console.log("New Purchase Request");
};

const Approve = () => {
  console.log("Approve action");
};

const GeneratePO = () => {
  console.log("Generate Purchase Order");
};

const PrintList = () => {
  console.log("Print Purchase Request List");
};

const exportToCSV = () => {
  console.log("Export to CSV");
};

const exportToExcel = () => {
  console.log("Export to Excel");
};

const searchList = () => {
  fetchPurchaseRequests();
  console.log("Search details");
};
// watch(searchString, () => {
//   // เรียกค้นหาข้อมูลเมื่อมีการกรอกอย่างน้อย 3 ตัวอักษร หรือเมื่อเคลียร์ข้อมูล
//   if (searchString.value.length >= 1 || searchString.value.length === 0) {
//     fetchPurchaseRequests(); // เรียกค้นหาข้อมูล
//   }
// });
const searchDetails = () => {
  fetchPurchaseRequests();
}
const sortData = (column: string) => {
  if (sortBy.value === column) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    direction.value = 'asc';
  }
  fetchPurchaseRequests();
};

const toggleSelectAll = (event: any) => {
  const checked = event.target.checked;
  request.value.forEach((request) => {
    request.selectedItems = checked;
  });
};

const hideDivMSG = () => {
  showAlertMsg.value = false;
};

const edit = (PurchaseRequestNo: string) => {
    console.log('Edit', PurchaseRequestNo);
};
const copy = (PurchaseRequestNo: string) => {
    console.log('Copy', PurchaseRequestNo);
};
const print = (PurchaseRequestNo: string) => {
    console.log('Print', PurchaseRequestNo);
};

const cancel = (PurchaseRequestNo: string, PurchaseRequestDateEn: any) => {
    console.log('Cancel', PurchaseRequestNo, PurchaseRequestDateEn);
};
const handleAction = (data: { PurchaseRequestNo: string; PurchaseRequestDateEn: any; StatusCode: number }, action: any) => {
    switch (action) {
        case 'edit':
            edit(data.PurchaseRequestNo);
            break;
        case 'copy':
            copy(data.PurchaseRequestNo);
            break;
        case 'print':
            print(data.PurchaseRequestNo);
            break;
        case 'cancel':
            cancel(data.PurchaseRequestNo, data.PurchaseRequestDateEn);
            break;
    }
};

const toggleDropdown = (data: { PurchaseRequestNo: string; }) => {
    dropdownVisible.value[data.PurchaseRequestNo] = !dropdownVisible.value[data.PurchaseRequestNo];
};

const closeDropdown = (data: { PurchaseRequestNo: string; }) => {
    dropdownVisible.value[data.PurchaseRequestNo] = false;
};

const SortBy = (key: string) => {
  console.log('Sort by:', sortBy.value);
  if (key === sortBy.value) {
    direction.value = direction.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = key
    direction.value = 'DESC'
  }
  fetchPurchaseRequests()
}
// เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  fetchPurchaseRequests();
});
</script>

<style scoped>
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

.pagination {
  display: inline-block;
  cursor: pointer;
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}

.pagination a.active {
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
}

.pagination a:hover:not(.active) {
  background-color: #ddd;
  border-radius: 5px;
}

/* html,
body {
  height: 100%;
  margin: 0;
}

.container {
  width: 100vw;
  height: 100vh;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow-y: auto;
}

.breadcrumb {
  width: 100%;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: gray;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.caption-subject {
  color: rgb(48, 165, 200);
  font-weight: bolder;
  font-size: 1.5em;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.btn {
  padding: 10px 15px;
  border: none;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin: 0 5px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.alert {
  padding: 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin-bottom: 20px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  color: #333;
}

.table th {
  background-color: #f2f2f2;
  color: rgb(24, 108, 164);
  font-weight: bold;
}

.table tr {
  border-bottom: 1px solid #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #f2f2f2;
  border: none;
  color: black;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #ddd;
}

.pagination button:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-group input {
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
}

.input-group-btn {
  margin-left: 5px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
} */
</style>
