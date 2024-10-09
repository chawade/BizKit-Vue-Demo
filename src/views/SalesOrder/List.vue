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
                <DataTable v-model:selection="selectedItems" :value="sortedItems" :rows="10" dataKey="SalesOrderID"
                    :loading="fetchLoading" :rowsPerPageOptions="[5, 10, 25]" :paginator="true" :lazy="true"
                    :totalRecords="totalRecords" scrollHeight="400px" tableStyle="min-width: 50rem" filterDisplay="menu"
                    @page="onPageChange" @sort="onSort" @row-select="onRowSelect" @row-unselect="onRowUnselect">
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
                                        <!-- First row -->
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

                                        <!-- Second row -->
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

                                        <!-- Third row -->
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
                    <Column v-if="selectedColumns.length > 0"  header="" style="width: 5%">
                        <template #body="{ data }">
                            <Button type="button" icon="pi pi-cog" class="p-button-text" @click="toggleMenu"
                                aria-haspopup="true" aria-controls="overlay_menu" />
                            <Menu ref="menu" id="overlay_menu" :model="menuaa" :popup="true" />
                        </template>
                    </Column>
                    <Column v-if="selectedColumns.length > 0" selectionMode="multiple" headerStyle="width: 3rem"
                        style="width: 5%"></Column>
                    <Column v-for="col of selectedColumns" :key="col.field" :field="col.field" :header="col.header"
                        :sortable="col.sortable" :style="col.style" :showFilterMenu="col.filterable"
                        :filterField="col.filterField">
                        <template #body="slotProps" v-if="col.field === 'SalesOrderNumber'">
                            <router-link :to="`/SalesOrder/Detail/${slotProps.data.SalesOrderNumber}`" custom
                                v-slot="{ navigate }">
                                <Button :label="slotProps.data.SalesOrderNumber" link @click="navigate" class="p-0" />
                            </router-link>
                        </template>
                        <template #body="slotProps" v-else-if="col.field === 'Status.StatusName'">
                            <Tag :value="slotProps.data.Status.StatusName"
                                :style="{ border: slotProps.data.Status.StatusBorderColor, backgroundColor: slotProps.data.Status.StatusBgColor, color: slotProps.data.Status.StatusFontColor, fontSize: slotProps.data.Status.StatusFontSize }" />
                        </template>
                        <template #filter="{ filterModel }" v-if="col.filterable">
                            <InputText v-model="filterModel.value" type="text" class="p-column-filter"
                                placeholder="Search" />
                        </template>
                    </Column>
                    <template #footer>
                        <div class="p-text-center p-m-4">
                            <MultiSelect v-model="selectedColumns" :options="columns" optionLabel="header"
                                @change="onColumnToggle" display="chip" placeholder="Select Columns" class="w-full" />
                        </div>
                    </template>
                    <template #empty>
                        <div class="p-text-center p-m-4">
                            <Tag style="width: 100%; min-height: 70px" severity="secondary"
                                value="No records available">
                            </Tag>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, type Ref, reactive, onUnmounted } from 'vue'
import SalesOrderService from '@/Service/salesorderService'
import type Menu from 'primevue/menu';
import type { SalesOrderResource, SalesOrderSearch } from '@/Model/SalesOrder';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';

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
const toast = useToast();
const dt = ref();
const router = useRouter();
const items = ref<SalesOrderResource[]>([]);
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(10)
const searchString = ref('')
const sortKey = ref('SODate')
const sortOrder = ref('DESC')
const totalRecords = ref(0)
const selectedItems = ref([]);
const selectedTakingIds = ref<number[]>([]);
const loading = ref(false);
const fetchLoading = ref(true);
const error = ref(false);
const menu = ref<InstanceType<typeof Menu> | null>(null);
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

interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  style?: string;
  filterable?: boolean;
  filterField?: string;
}
const selectedColumns = ref<ColumnDef[]>([]);
const onColumnToggle = (event: { value: ColumnDef[] }) => {
    selectedColumns.value = event.value;
};
const columns = ref<ColumnDef[]>([
      { field: 'SalesOrderNumber', header: 'SalesOrder No.', sortable: true, style: 'width: 15%' },
      { field: 'SalesOrderDate', header: 'Order Date', sortable: true, style: 'width: 15%' },
      { field: 'CustomerName', header: 'Customer', sortable: true, style: 'width: 15%' },
      { field: 'DeliveryDate', header: 'Delivery Date', sortable: true, style: 'width: 15%'},
      { field: 'Status.StatusName', header: 'Status', sortable: true, style: 'width: 20%; text-align: center;' },
      { field: 'OrderQuantity', header: 'Order Qty', sortable: true, style: 'width: 1%'},
      { field: 'PickQuantity', header: 'Pick Qty', style: 'width: 10%'},
      { field: 'ShipQuantity', header: 'Ship Qty', style: 'width: 10%'},
      { field: 'PickQuantity - ShipQuantity', header: 'Balance', style: 'width: 10%'},
      { field: 'TotalAmount', header: 'Total Amount', sortable: true, style: 'width: 15%'}
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


const sortedItems = computed(() => {
    return items.value
})

const toggleMenu = (event: Event) => {
    menu.value?.toggle(event);
};

const onPageChange = (event: { first: number, rows: number, page: number }) => {
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
            if (result.IsSuccess) {
                items.value = result.Data || [];
                totalRecords.value = result.Pagination?.TotalRecords ?? 0;
                totalPages.value = result.Pagination?.TotalPages ?? 0;
            } else {
                toast.add({ severity: 'error', summary: result.StatusCode.toString() , detail: result.Error?.Message, life: 2000 });
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
    items.value = [];
    totalRecords.value = 0;
    totalPages.value = 0;
    subscription = SalesOrderService.search(endpoint).subscribe({
        next: (result) => {
            if (result.IsSuccess) {
                items.value = result.Data || [];
                totalRecords.value = result.Pagination?.TotalRecords ?? 0;
                totalPages.value = result.Pagination?.TotalPages ?? 0;
            } else {
                const statusCode = result.StatusCode.toString() || 'Unknown';
                const errorMessage = result.Error?.Message || 'An error occurred';
                toast.add({ severity: 'error', summary: statusCode , detail: errorMessage, life: 2000 });
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

onMounted(() => {
    fetchData()
    selectedColumns.value = [...columns.value];
})

onUnmounted(() =>{
    subscription.unsubscribe();
})

watch(selectedItems, (newSelectedItems) => {
    selectedTakingIds.value = newSelectedItems.map((item: any) => item.TakingId);
    console.log('Updated Selected TakingIds:', selectedTakingIds.value);
});

</script>

