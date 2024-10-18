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
        <ItemTable  :items="sortedItems" :columns="columns" :dataKey="'purchaseRequestNo'" :rows-per-page="pageSize" :pageIdentifier="'purchaseRequest'"
                    :rowsPerPageOptions="[5, 10, 25]" :selection="selectedItems" :loading="fetchLoading" :lazy="true"
                    :totalRecords="totalRecords" @page="onPageChange"
                    @update:selection="onRowSelect" @sort="onSort" @search="fetchPurchaseRequests" :menu="menuaa">
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
                      <InputText id="PRNo" v-model="searchPR.prNo" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="vendor">Vendor</label>
                      <Select v-model="searchPR.vendor" id="vendor" class="form-select rounded-md shadow-sm">
                      </Select>
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="status">Status</label>
                      <Select v-model="searchPR.status" id="status" class="form-select rounded-md shadow-sm">
                      </Select>
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="referenceNo">Reference No.</label>
                      <InputText id="referenceNo" v-model="searchPR.referenceNo" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>

                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="remark">Remark</label>
                      <InputText id="remark" v-model="searchPR.remark" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="itemCode">Item Code</label>
                      <InputText id="itemCode" v-model="searchPR.itemCode" type="text"
                        class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="itemName">Item Name</label>
                      <InputText id="itemName" v-model="searchPR.itemName" type="text"
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
                      <DatePicker v-model="searchPR.periodFrom" selectionMode="range" :manual-input="false" id="PRDate"
                        showButtonBar class="form-input rounded-md shadow-sm" />
                    </div>
                    <div class="flex flex-col">
                      <label class="font-bold mb-1" for="requireDate">Require Date</label>
                      <DatePicker v-model="searchPR.deliveryDateFrom" selectionMode="range" :manual-input="false"
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

          <template #status="slotProps">
            <Tag class="min-w-28 max-w-28 text-wrap" :value="slotProps.data.status.statusName" :style="{
              backgroundColor: statusTheme(slotProps.data.status.statusId).bgColor,
              border: `1px solid ${statusTheme(slotProps.data.status.statusId).borderColor}`,
              color: statusTheme(slotProps.data.status.statusId).fontColor,
              fontSize: statusTheme(slotProps.data.status.statusId).fontSize
            }" />
          </template>

          <template #vendor="slotProps">
            {{ slotProps.data.vendor?.vendorName ?? '' }}
          </template>

          <template #purchaseRequestNo="slotProps">
            <router-link :to="`/PurchaseRequest/Detail/${slotProps.data.purchaseRequestNo}`" custom
              v-slot="{ navigate }">
              <Button :label="slotProps.data.purchaseRequestNo" link @click="navigate" class="p-0" />
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
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable';
import { Subscription } from 'rxjs';
import { useToast } from 'primevue/usetoast';
import type { PRHeaderSearch, PurchaseRequest } from '@/Model/purchaseRequest';
import ItemTable from '@/components/ItemTable.vue';
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable';
import StatusService from '@/service/statusService';
import { useDataTableStore } from '@/store/useDataTableStore';

let subscription: Subscription;
const searchPR = reactive<PRHeaderSearch>({
  prNo: '',
  companyID: 0,
  detailSearch: false,
  status: 0,
  vendorID: 0,
  vendor: ''
})
const dataTableStore = useDataTableStore();
const statusService = new StatusService();
const selectedColumns = ref<ColumnDef[]>([]);
const onColumnToggle = (event: { value: ColumnDef[] }) => {
  selectedColumns.value = event.value;
};
const columns = ref<ColumnDef[]>([
  { field: 'purchaseRequestNo', header: 'PRNo', sortable: true, class: 'width: 15%', headerClass: 'w-full text-center font-bold' },
  { field: 'purchaseRequestDate', header: 'PRDate', sortable: true, class: 'width: 15%', headerClass: 'w-full text-center font-bold' },
  { field: 'requireDate', header: 'RequireDate', sortable: true, class: 'width: 15%', headerClass: 'w-full text-center font-bold' },
  { field: 'vendor', header: 'Vendor', sortable: true, class: 'width: 15%', headerClass: 'w-full text-center font-bold' },
  { field: 'project', header: 'Project', sortable: true, class: 'width: 20%; text-align: center;', headerClass: 'w-full text-center font-bold' },
  { field: 'department', header: 'Department', sortable: true, class: 'width: 1%', headerClass: 'w-full text-center font-bold' },
  { field: 'amount', header: 'Amount', sortable: true, class: 'width: 10%', headerClass: 'w-full text-center font-bold' },
  { field: 'status', header: 'Status', sortable: true, class: 'width: 10%', headerClass: 'w-full text-center font-bold' }
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

const statusTheme = (statusId: number) => {
  return statusService.getStatusTheme(statusId)
}
const selectedPurchaseRequestNo = ref<string[]>([]);

const fetchPurchaseRequests = async () => {
  debugger
  fetchLoading.value = true;
  const endpoint = `${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${searchString.value}`;
  request.value = [];
  console.log(request);
  subscription = PurchaseRequestService.search(endpoint).subscribe({
    next: (result) => {
      if (result.isSuccess) {
        request.value = result.data || [];
        dataTableStore.setTotalRecords(result.pagination?.totalRecords ?? 0);
      } else {
        const statusCode = result.statusCode.toString() || 'Unknown';
        const errorMessage = result.error?.message || 'An error occurred';
        toast.add({ severity: 'error', summary: statusCode, detail: errorMessage, life: 2000 });
      }
    },
    error: (error) => {
      toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
    },
    complete: () => {
      if(isSelectAll.value){
                selectedItems.value = request.value
            }
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

const onRowSelect = (value: any[]) => {
  selectedItems.value = value;
  isSelectAll.value = selectedItems.value.length === sortedItems.value.length
};
// const onRowUnselect = (event: any) => {
//   const purchaserequestNo = event.data.TakingId;
//   const index = selectedPurchaseRequestNo.value.indexOf(purchaserequestNo);
//   if (index > -1) {
//     purchaserequestNo.value.splice(index, 1);
//   }
//   console.log('Selected PurchaserequestNo:', purchaserequestNo.value);
//   return purchaserequestNo.value;
// };

const sortedItems = computed(() => {
  return request.value
})

const submitForm = async () => {

}

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

// const toggleSelectAll = (event: any) => {
//   const checked = event.target.checked;
//   request.value.forEach((request) => {
//     request.selectedItems = checked;
//   });
// };

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
const onPageChange = (event: DataTablePageEvent) => {
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
/* .hoverTable {
  width: 100%;
  border-collapse: collapse;
}

.hoverTable tbody td {
  padding: 7px;
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
} */
</style>
