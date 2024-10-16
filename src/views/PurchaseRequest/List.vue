<template>
  <div v-if="loading" class="justify-center"
    style="width: 100%; height: 100%; text-align: center; vertical-align: middle;">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="card">
      <div class="col-sm-8 flex justify-between mb-8">
        <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Purchase Request List</h4>
        <router-link to="/PurchaseRequest/Maintain">
          <Button icon="pi pi-plus-circle" label="New Purchase Request" severity="success" />
        </router-link>
      </div>

      <div class="table-scrollable table-list">
        <ItemTable :items="sortedItems" :columns="columns" :dataKey="'PurchaseRequestNo'" :rows-per-page="pageSize"
          :rowsPerPageOptions="[5, 10, 25]" :selection="selectedItems" :loading="fetchLoading" :lazy="true"
          :totalRecords="totalRecords" @page="onPageChange" selectionMode="multiple" @update:selection="onRowSelect"
          @sort="onSort" @search="fetchPurchaseRequests" :menu="menuaa">
          <template #header>
            <Menubar :model="filteredMenuItems" class="hidden md:flex">
              <template #start>
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearSearch" />
              </template>
              <template #end>
                <IconField>
                  <InputGroup>
                    <InputText v-model="searchString" placeholder="PR No., Vendor Name, Status" />
                    <Button icon="pi pi-search" severity="info" @click="searchList" />
                    <Button icon="pi pi-bars" class="p-button-text" severity="info"
                      v-styleclass="{ selector: '#searchDetail', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }" />
                  </InputGroup>
                </IconField>
              </template>
            </Menubar>
            <div id="searchDetail"
              class="config-panel hidden w-full p-4 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <div class="w-full">
                <form @submit.prevent="submitForm">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="PRNo">PR No.</label>
                      <InputText id="PRNo" v-model="searchPR.PRNo" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="vendor">Vendor</label>
                      <Select v-model="searchPR.Vendor" id="vendor" class="form-select rounded-md shadow-sm">
                      </Select>
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="status">Status</label>
                      <Select v-model="searchPR.Status" id="status" class="form-select rounded-md shadow-sm">
                      </Select>
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="referenceNo">Reference No.</label>
                      <InputText id="referenceNo" v-model="searchPR.ReferenceNo" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>

                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="remark">Remark</label>
                      <InputText id="remark" v-model="searchPR.Remark" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="itemCode">Item Code</label>
                      <InputText id="itemCode" v-model="searchPR.ItemCode" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="itemName">Item Name</label>
                      <InputText id="itemName" v-model="searchPR.ItemName" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="amount">Amount</label>
                      <div class="flex gap-2">
                        <InputText id="amountFrom" v-model="searchPR.stringTotalFrom" type="text"
                          class="form-input rounded-md shadow-sm w-1/2" placeholder="From" />
                        <InputText id="amountTo" v-model="searchPR.stringTotalTo" type="text"
                          class="form-input rounded-md shadow-sm w-1/2" placeholder="To" />
                      </div>
                    </div>

                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="PRDate">PR Date</label>
                      <DatePicker v-model="searchPR.PeriodFrom" selectionMode="range" :manual-input="false" id="PRDate"
                        showButtonBar class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="requireDate">Require Date</label>
                      <DatePicker v-model="searchPR.DeliveryDateFrom" selectionMode="range" :manual-input="false"
                        id="requireDate" showButtonBar class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex items-end">
                      <Button type="submit" label="Detail Search" severity="info"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </template>

          <template #Status="slotProps">
            <Tag class="min-w-28 max-w-28 text-wrap" :value="slotProps.data.Status.StatusName" :style="{
              border: slotProps.data.Status.StatusBorderColor,
              backgroundColor: slotProps.data.Status.StatusBgColor,
              color: slotProps.data.Status.StatusFontColor,
              fontSize: slotProps.data.Status.StatusFontSize
            }" />
          </template>

          <template #Vendor="slotProps">
            {{ slotProps.data.Vendor?.VendorName ?? '' }}
          </template>

          <template #PurchaseRequestNo="slotProps">
            <router-link :to="`/PurchaseRequest/Detail/${slotProps.data.PurchaseRequestNo}`" custom
              v-slot="{ navigate }">
              <Button :label="slotProps.data.PurchaseRequestNo" link @click="navigate" class="p-0" />
            </router-link>
          </template>

        </ItemTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref, reactive, onUnmounted } from 'vue';
import PurchaseRequestService from '@/Service/purchaseRequestService';
import type Menu from 'primevue/menu';
import { computed } from 'vue';
import type { DataTableSortEvent } from 'primevue/datatable';
import { Subscription } from 'rxjs';
import { useToast } from 'primevue/usetoast';
import type { PRHeaderSearch, PurchaseRequest } from '@/Model/purchaseRequest';
import ItemTable from '@/components/ItemTable.vue';
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable';

let subscription: Subscription;
const searchPR = reactive<PRHeaderSearch>({
  PRNo: '',
  CompanyID: 0,
  DetailSearch: false,
  Status: 0,
  VendorID: 0,
  Vendor: ''
})

const selectedColumns = ref<ColumnDef[]>([]);
const onColumnToggle = (event: { value: ColumnDef[] }) => {
  selectedColumns.value = event.value;
};
const columns = ref<ColumnDef[]>([
  { field: 'PurchaseRequestNo', header: 'PRNo', sortable: true, class: 'width: 15%', headerClass: 'w-full text-center font-bold' },
  { field: 'PurchaseRequestDate', header: 'PRDate', sortable: true, class: 'width: 15%' , headerClass: 'w-full text-center font-bold' },
  { field: 'RequireDate', header: 'RequireDate', sortable: true, class: 'width: 15%' , headerClass: 'w-full text-center font-bold' },
  { field: 'Vendor', header: 'Vendor', sortable: true, class: 'width: 15%' , headerClass: 'w-full text-center font-bold'},
  { field: 'Project', header: 'Project', sortable: true, class: 'width: 20%; text-align: center;' , headerClass: 'w-full text-center font-bold'},
  { field: 'Department', header: 'Department', sortable: true, class: 'width: 1%' , headerClass: 'w-full text-center font-bold'},
  { field: 'Amount', header: 'Amount', sortable: true, class: 'width: 10%' , headerClass: 'w-full text-center font-bold'},
  { field: 'Status', header: 'Status', sortable: true, class: 'width: 10%' , headerClass: 'w-full text-center font-bold'}
]);

const clearSearch = () => {
  pageNumber.value = 1
  pageSize.value = 10
  sortBy.value = 'PRDate'
  direction.value = 'DESC'
  searchString.value = ''
  fetchPurchaseRequests()
}
const isSelectAll = ref(false);
const toast = useToast();
const dropdownVisible: Ref<Record<string, boolean>> = ref({});
const menu = ref<InstanceType<typeof Menu> | null>(null);
const selectedItems = ref<any[]>([]);
const request = ref<PurchaseRequest[]>([]);
const loading = ref(false);
const fetchLoading = ref(false);
const error = ref<string | null>(null);
const totalPages = ref(1);
const totalRecords = ref(0);
const pageNumber = ref(1);
const pageSize = ref(10);
const sortBy = ref('PRDate');
const direction = ref('DESC');
const searchString = ref('');
const permission = ref({
  APPROVE: true,
  MODIFY: true,
  PRINT: true,
  EXPORT: true
});

const selectedPurchaseRequestNo = ref<string[]>([]);

const fetchPurchaseRequests = async () => {
  fetchLoading.value = true;
  const endpoint = `${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${searchString.value}`;
  request.value = [];
  console.log(request);
  totalRecords.value = 0;
  totalPages.value = 0;
  subscription = PurchaseRequestService.search(endpoint).subscribe({
    next: (result) => {
      if (result.IsSuccess) {
        request.value = result.Data || [];
        totalRecords.value = result.Pagination?.TotalRecords ?? 0;
        totalPages.value = result.Pagination?.TotalPages ?? 0;
      } else {
        const statusCode = result.StatusCode.toString() || 'Unknown';
        const errorMessage = result.Error?.Message || 'An error occurred';
        toast.add({ severity: 'error', summary: statusCode, detail: errorMessage, life: 2000 });
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
const nestedMenuitems = ref([
  {
    label: 'Approve',
    icon: 'pi pi-check-circle',
    command: () => {

    }
  },
  {
    label: 'Generate Invoice',
    icon: 'pi pi-check-circle',
    command: () => {

    }
  },
  {
    label: 'Print',
    icon: 'pi pi-print',
    command: () => {

    }
  },
  {
    label: 'Export',
    items: [
      {
        label: 'Excel',
        icon: 'pi pi-fw pi-compass'
      },
      {
        label: 'CSV',
        icon: 'pi pi-fw pi-map-marker'
      }
    ]
  }
]);
const filteredMenuItems = computed(() => {
  return nestedMenuitems.value.filter(item => {
    if (item.label === 'Approve' || item.label === 'Generate Invoice' || item.label === 'Print') {
      return selectedItems.value.length > 0; // Show "Approve" only if status is 100
    }
    return true; // Show other items regardless of status
  });
});
const menuaa = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Detail',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Export',
        icon: 'pi pi-upload'
      },
      {
        label: 'Cancel',
        icon: 'pi pi-trash'
      }
    ]
  }
]);
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};
const onRowSelect = (value: any[]) => {
  selectedItems.value = value;
  isSelectAll.value = selectedItems.value.length === sortedItems.value.length
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

const sortedItems = computed(() => {
  return request.value
})

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
//   if (searchString.value.length >= 2 || searchString.value.length === 0) {
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

const onSort = (event: DataTableSortEvent) => {
  debugger
  const sortField = event.sortField;
  const Key = event.sortOrder;
  switch (Key) {
    case 1:
      direction.value = 'ASC';
      break;
    default:
      direction.value = 'DESC';
      break;
  }

  switch (sortField) {
    case 'PurchaseRequestNo':
      sortBy.value = 'PRNo';
      break;
    case 'PurchaseRequestDate':
      sortBy.value = 'PRDate';
      break;
    case 'RequireDate':
      sortBy.value = 'DeliveryDate';
      break;
    case 'Vendor':
      sortBy.value = 'VendorName';
      break;
    case 'Status':
      sortBy.value = 'Status';
      break;
    case 'Amount':
      sortBy.value = 'Subtotal';
      break;
    default:
      sortBy.value = 'PRDate';
      break;
  }
  fetchPurchaseRequests();
};
const onPageChange = (event: { first: number, rows: number, page: number }) => {
  // Update state   
  pageNumber.value = event.page + 1;
  pageSize.value = event.rows;
  // Handle data loading for the new page (pagination)
  fetchPurchaseRequests();
}

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
})
onUnmounted(() => {
  subscription.unsubscribe();
})

watch(selectedItems, (newSelectedItems) => {

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
