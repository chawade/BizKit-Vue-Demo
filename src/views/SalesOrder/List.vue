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
            <div class="row">
                <div class="col-sm-8 mb-5">
                    <div v-if="permission.EXPORT" class="grid gap-2" role="group">
                        <div class="col-span-full lg:col-span-8 flex flex-wrap gap-2">
                            <Button label="Adjust Stock" severity="success" class="w-full sm:w-auto"
                                @click="approves" />
                            <Button label="ExportCSV" severity="info" class="w-full sm:w-auto" @click="exportToCSV" />
                            <Button label="ExportExcel" severity="info" class="w-full sm:w-auto"
                                @click="exportToExcel" />
                        </div>

                        <div class="col-span-full lg:col-span-2 mt-2 lg:mt-0 lg:col-start-9">
                            <span class="p-input-icon-right w-full">

                            </span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="table-scrollable table-list">
                <DataTable v-model:selection="selectedItems" :value="sortedItems" :rows="10" dataKey="SalesOrderID"
                    :loading="fetchLoading" :rowsPerPageOptions="[5, 10, 25]" :paginator="true":lazy="true" 
                    :totalRecords="totalRecords" scrollHeight="400px" tableStyle="min-width: 50rem" @page="onPageChange" @sort="onSort"
                    @row-select="onRowSelect" @row-unselect="onRowUnselect">
                    <template #header>
                        <div class="flex justify-between">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="" />
                            <IconField>
                                <InputGroup>
                                    <InputText v-model="searchString" placeholder="Keyword Search" />
                                    <Button icon="pi pi-search" severity="info" @click="search" />
                                    <Button icon="pi pi-bars" class="p-button-text" severity="info"
                                        v-styleclass="{ selector: '#searchDetail', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }" />
                                </InputGroup>
                            </IconField>

                        </div>
                        <div id="searchDetail"
                            class="config-panel hidden w-full p-4 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <div class="w-full">
                                <form @submit.prevent="">
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
                    <Column header="" style="width: 5%">
                        <template #body="{ data }">
                            <Button type="button" icon="pi pi-cog" class="p-button-text" @click="toggleMenu"
                                aria-haspopup="true" aria-controls="overlay_menu" />
                            <Menu ref="menu" id="overlay_menu" :model="menuaa" :popup="true" />
                        </template>
                    </Column>
                    <Column selectionMode="multiple" headerStyle="width: 3rem" style="width: 5%"></Column>
                    <Column field="SalesOrderNumber" header="SalesOrder No." sortable style="width: 15%">
                        <template #body="{ data }">
                            <router-link :to="`/SalesOrder/Detail/${data.SalesOrderNumber}`" custom
                                v-slot="{ navigate }">
                                <Button :label="data.SalesOrderNumber" link @click="navigate" class="p-0" />
                            </router-link>
                        </template>
                    </Column>
                    <Column field="SalesOrderDate" header="Order Date" sortable style="width: 15%"></Column>
                    <Column field="CustomerName" header="Customer" sortable style="width: 15%"></Column>
                    <Column field="DeliveryDate" header="Delivery Date" sortable style="width: 15%;"></Column>
                    <Column field="Status.StatusName" header="Status" sortable style="width: 20%;  text-align: center;">
                        <template #body="{ data }">
                            <Tag :value="data.Status.StatusName"
                                :style="{ border: data.Status.StatusBorderColor, backgroundColor: data.Status.StatusBgColor, color: data.Status.StatusFontColor, fontSize: data.Status.StatusFontSize }" />
                        </template>
                    </Column>
                    <Column field="OrderQuantity" header="Order Qty" sortable style="width: 1%"></Column>
                    <Column field="PickQuantity" header="Pick Qty" style="width: 10%"></Column>
                    <Column field="ShipQuantity" header="Ship Qty" style="width: 10%"></Column>
                    <Column field="PickQuantity - ShipQuantity" header="Balance" style="width: 10%"></Column>
                    <Column field="TotalAmount" header="Total Amount" sortable style="width: 15%"></Column>
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
import { ref, computed, onMounted, watch, type Ref, reactive } from 'vue'
import SalesOrderService from '@/Service/salesorderService'
import type Menu from 'primevue/menu';
import { useToast } from 'primevue/usetoast';
import type { SalesOrderSearch } from '@/Model/SalesOrder';

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
const items = ref([])
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


const fetchData = async () => {
    try {
        fetchLoading.value = true;
        const response = await SalesOrderService.search(`${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`)

        items.value = response.Data
        totalRecords.value = response.Pagination?.TotalRecords ?? 0
        totalPages.value = response.Pagination?.TotalPages ?? 0
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    finally {
        fetchLoading.value = false;
    }
}

const approves = async () => {
    try {
        loading.value = true;
        await SalesOrderService.approves(selectedTakingIds.value);
        fetchData();
    } catch (error) {
        console.error('Error fetching data:', error)
    }
};

const exportToCSV = () => {
    console.log('Export CSV');
}

const exportToExcel = () => {
    console.log('Export Excel');
}

const search = () => {
    currentPage.value = 1
    fetchData()
}

const edit = (takingId: number) => {
    console.log('Edit', takingId);
};

const copy = (takingId: number) => {
    console.log('Copy', takingId);
};

const print = (takingId: number) => {
    console.log('Print', takingId);
};

const cancel = (takingId: number, takingDateEn: any) => {
    console.log('Cancel', takingId, takingDateEn);
};

const handleAction = (data: { TakingId: number; TakingDateEn: any; StatusCode: number }, action: any) => {
    switch (action) {
        case 'edit':
            edit(data.TakingId);
            break;
        case 'copy':
            copy(data.TakingId);
            break;
        case 'print':
            print(data.TakingId);
            break;
        case 'cancel':
            cancel(data.TakingId, data.TakingDateEn);
            break;
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

onMounted(() => {
    fetchData()
})

watch(selectedItems, (newSelectedItems) => {
    selectedTakingIds.value = newSelectedItems.map((item: any) => item.TakingId);
    console.log('Updated Selected TakingIds:', selectedTakingIds.value);
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
</style>
