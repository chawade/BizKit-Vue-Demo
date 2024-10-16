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
                <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Sales Order</h4>
                <router-link to="/SalesOrder/Maintain/">
                    <Button icon="pi pi-plus-circle" label="Create Sales Order" severity="success" />
                </router-link>
            </div>

            <div class="table-scrollable table-list">
                <ItemTable :items="sortedItems" :columns="columns" :dataKey="'salesOrderID'" :rows-per-page="pageSize" :pageIdentifier="'salesOrder'"
                    :rowsPerPageOptions="[5, 10, 25]" :selection="selectedItems" :loading="fetchLoading" :lazy="true"
                    :totalRecords="totalRecords" @page="onPageChange"
                    @update:selection="onRowSelect" @sort="onSort" @search="fetchData" :menu="menuaa">
                    <template #header>
                        <Menubar :model="filteredMenuItems" class="hidden md:flex">
                            <template #start>
                                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                    @click="clearSearch" />
                            </template>
                            <template #end>
                                <IconField>
                                    <InputGroup>
                                        <InputText v-model="searchString" placeholder="Keyword Search" />
                                        <Button icon="pi pi-search" severity="info" @click="search" />
                                        <Button icon="pi pi-bars" class="p-button-text" severity="info"
                                            v-styleclass="{ selector: '#searchDetail', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }" />
                                    </InputGroup>
                                </IconField>
                            </template>
                        </Menubar>
                        <div id="searchDetail"
                            class="config-panel hidden w-full p-4 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <div class="w-full">
                                <form @submit.prevent="searchDetail">
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="SONo">SalesOrder No.</label>
                                            <InputText id="SONo" v-model="searchSo.salesOrderNo" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="customer">Customer</label>
                                            <InputText id="customer" v-model="searchSo.customer" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="status">Status</label>
                                            <Select v-model="searchSo.status" id="status"></Select>
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="warehouse">Warehouse</label>
                                            <Select v-model="searchSo.warehouse" id="warehouse"
                                                class="form-select rounded-md shadow-sm">
                                            </Select>
                                        </div>

                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="pickingNo">Picking No.</label>
                                            <InputText id="pickingNo" v-model="searchSo.pickingNo" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="personInCharge">Person in
                                                charge</label>
                                            <InputText id="personInCharge" v-model="searchSo.personInCharge" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="itemCode">Item code</label>
                                            <InputText id="itemCode" v-model="searchSo.itemCode" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="itemName">Item name</label>
                                            <InputText id="itemName" v-model="searchSo.itemName" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>

                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="purchaseOrderDate">Purchase order
                                                date</label>
                                            <Select v-model="searchSo.purchaseOrderDate" id="purchaseOrderDate"
                                                class="form-select rounded-md shadow-sm">
                                            </Select>
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="dateRange">Date Range</label>
                                            <DatePicker v-model="searchSo.dateRange" selectionMode="range"
                                                :manual-input="false" id="dateRange" showButtonBar
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label class="font-bold mb-1" for="remark">Remark</label>
                                            <InputText id="remark" v-model="searchSo.remark" type="text"
                                                class="form-input rounded-md shadow-sm" />
                                        </div>
                                        <div class="flex items-end">
                                            <Button type="submit"
                                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out">
                                                Search
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

                    <template #salesOrderNumber="slotProps">
                        <RouterLink :to="`/SalesOrder/Detail/${slotProps.data.salesOrderNumber}`" custom
                            v-slot="{ navigate }">
                            <Button :label="slotProps.data.salesOrderNumber" link @click="navigate" class="p-0" />
                        </RouterLink>
                    </template>

                </ItemTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, type Ref, reactive, onUnmounted } from 'vue'
import SalesOrderService from '@/service/salesorderService'
import type Menu from 'primevue/menu';
import type { SalesOrderResource, SalesOrderSearch } from '@/Model/SalesOrder';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import ItemTable from '@/components/ItemTable.vue';
import type { DataTablePageEvent } from 'primevue/datatable';
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable';
import StatusService from '@/service/statusService';
import { useDataTableStore } from '@/store/useDataTableStore';

let subscription: Subscription;
const searchSo = reactive<SalesOrderSearch>({
    salesOrderNo: '',
    customer: '',
    status: 0,
    warehouse: 0,
    pickingNo: '',
    personInCharge: '',
    itemCode: '',
    itemName: '',
    purchaseOrderDate: null,
    dateRange: null,
    remark: ''
})
const statusService = new StatusService();
const toast = useToast();
const isSelectAll = ref(false);
const router = useRouter();
const dataTableStore = useDataTableStore();
const items = ref<SalesOrderResource[]>([]);
const currentPage = ref(1)
const pageSize = ref(5)
const searchString = ref('')
const sortKey = ref('SODate')
const sortOrder = ref('DESC')
const totalRecords = ref(0)
const selectedItems = ref<any[]>([]);
const loading = ref(false);
const fetchLoading = ref(true);
const error = ref(false);
const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
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

const onSort = (event: any) => {
    debugger
    const sortField:string = event.sortField;
    const Key:number = event.sortOrder;
    switch (Key) {
        case 1:
            sortOrder.value = 'ASC';
            break;
        default:
            sortOrder.value = 'DESC';
            break;
    }

    switch (sortField) {
        case 'SalesOrderNumber':
            sortKey.value = 'SONo';
            break;
        case 'SalesOrderDate':
            sortKey.value = 'SODate';
            break;
        case 'CustomerName':
            sortKey.value = 'CustomerName';
            break;
        case 'DeliveryDate':
            sortKey.value = 'DeliveryDate';
            break;
        case 'Status':
            sortKey.value = 'Status';
            break;
        case 'OrderQuantity':
            sortKey.value = 'OrderQty';
            break;
        case 'TotalAmount':
            sortKey.value = 'TotalAmount';
            break;
        default:
            sortKey.value = 'SODate';
            break;
    }
    fetchData();
};


const columns = ref<ColumnDef[]>([
      { field: 'salesOrderNumber', header: 'SalesOrder No.', sortable: true, class: 'text-left' , headerClass: 'w-full min-w-36 text-center font-bold' },
      { field: 'salesOrderDate', header: 'Order Date', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold' },
      { field: 'customerName', header: 'Customer', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold' },
      { field: 'deliveryDate', header: 'Delivery Date', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold'},
      { field: 'status', header:  'Status', sortable: true, class: 'width: 20%; text-align: center;', headerClass: 'w-full min-w-36 text-center font-bold' },
      { field: 'orderQuantity', header: 'Order Qty', sortable: true, class: 'width: 1%; text-align: end;', headerClass: 'w-full min-w-20 text-center font-bold'},
      { field: 'pickQuantity', header: 'Pick Qty', class: 'text-right', headerClass: 'w-full min-w-20 text-center font-bold'},
      { field: 'shipQuantity', header: 'Ship Qty', class: 'width: 10%; text-align: end;', headerClass: 'w-full min-w-20 text-center font-bold'},
      { field: 'pickQuantity - ShipQuantity', header: 'Balance', class: 'width: 10%; text-align: end;', headerClass: 'w-full min-w-20 text-center font-bold'},
      { field: 'totalAmount', header: 'Total Amount', sortable: true, class: 'width: 15%; text-align: end;', headerClass: 'w-full min-w-28 text-center font-bold'}
    ]);

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
const statusTheme = (statusId:number) => {
    return statusService.getStatusTheme(statusId)
}
const sortedItems = computed(() => {
    return items.value
})

const onPageChange = (event: DataTablePageEvent) => {
    // Update state   
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    // Handle data loading for the new page (pagination)
    fetchData();
}

const clearSearch = () => {
    currentPage.value = 1
    pageSize.value = 10
    sortKey.value = 'SODate'
    sortOrder.value = 'DESC'
    searchString.value = ''
    fetchData()
}


const searchDetail = () => {
    fetchLoading.value = true;
    subscription = SalesOrderService.searchDetail(searchSo).subscribe({
        next: (result) => {
            debugger;
            if (result.isSuccess) {
                items.value = result.data || [];
                dataTableStore.setTotalRecords(result.pagination?.totalRecords ?? 0);
            } else {
                toast.add({ severity: 'error', summary: result.statusCode.toString() , detail: result.error?.message, life: 2000 });
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

const fetchData = () => {
    fetchLoading.value = true;
    const endpoint = `${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`;
    subscription = SalesOrderService.search(endpoint).subscribe({
        next: (result) => {
            if (result.isSuccess) {
                items.value = result.data || [];
                dataTableStore.setTotalRecords(result.pagination?.totalRecords ?? 0);
            } else {
                const statusCode = result.statusCode.toString() || 'Unknown';
                const errorMessage = result.error?.message || 'An error occurred';
                toast.add({ severity: 'error', summary: statusCode , detail: errorMessage, life: 2000 });
            }
        },
        error: (error) => {
            toast.add({ severity: 'error', summary: 'Error fetching data', detail: error, life: 2000 });
        },
        complete: () => {
            if(isSelectAll.value){
                selectedItems.value = items.value
            }
            fetchLoading.value = false;
        }
    });
}

const filteredMenuItems = computed(() => {
  return nestedMenuitems.value.filter(item => {
    if (item.label === 'Approve' || item.label === 'Generate Invoice' || item.label === 'Print') {
      return selectedItems.value.length > 0; // Show "Approve" only if status is 100
    }
    return true; // Show other items regardless of status
  });
});

const search = () => {
    currentPage.value = 1
    fetchData()
}

const onRowSelect = (value: any[]) => {
    selectedItems.value = value;
    isSelectAll.value = selectedItems.value.length === sortedItems.value.length
};

onMounted(() => {
    fetchData()
})

onUnmounted(() =>{
    subscription.unsubscribe();
})

watch(selectedItems, (newSelectedItems) => {
    
});

</script>

