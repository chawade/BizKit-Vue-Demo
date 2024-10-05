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
                <router-link to="/StockTaking/Maintain/">
                    <Button icon="pi pi-plus-circle" label="Create Stock Taking" severity="success" />
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
                                <InputGroup>
                                    <InputText v-model="searchString" class="w-full" type="text" size="medium"
                                        placeholder="SalesOrder No., Customer" />
                                    <Button icon="pi pi-search" severity="info" @click="search" />
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
                                        <label class="font-bold" for="SONo">SalesOrder No.</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Customer</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Status</label>
                                        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Warehouse</label>
                                        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full" />
                                    </div>
                                </div>
                            </div>

                            <!-- Second row -->
                            <div class="flex flex-col mt-4 lg:flex-row lg:justify-center">
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">     
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Picking No.</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Person in charge</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Item code</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Item name</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>
                            </div>

                            <!-- Third row -->
                            <div class="flex flex-col mt-4 lg:flex-row lg:justify-center">
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">     
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Purchase order date</label>
                                        <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select a City" class="w-full" />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Date</label>
                                        <DatePicker v-model="dates" selectionMode="range" :manualInput="false" showButtonBar />
                                    </div>
                                </div>
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <div class="flex flex-col gap-2">
                                        <label class="font-bold" for="SONo">Remark</label>
                                        <InputText id="username" v-model="value" aria-describedby="username-help" />
                                    </div>
                                </div>     
                                <div class="flex-col items-start mt-2 lg:flex-row gap-4 lg:ml-2 xl:ml-5 xl:w-[40%]">
                                    <Button label="search" severity="info" />
                                </div>
                            </div>                        
                        </form>

                    </div>
                </div>


            </div>

            <div class="table-scrollable table-list">
                <DataTable v-model:selection="selectedItems" :value="sortedItems" :rows="10" dataKey="SalesOrderID"
                    :loading="fetchLoading" :lazy="true" :rowsPerPageOptions="[5, 10, 25]" scrollable :paginator="true"
                    :totalRecords="totalRecords" scrollHeight="400px" tableStyle="min-width: 50rem"
                    @row-select="onRowSelect" @row-unselect="onRowUnselect" @page="onPageChange">
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
                            <router-link :to="`/StockTaking/Detail/${data.TakingId}`" custom v-slot="{ navigate }">
                                <Button :label="data.SalesOrderNumber" link @click="navigate" class="p-0" />
                            </router-link>
                        </template>
                    </Column>
                    <Column field="SalesOrderDate" header="Order Date" sortable style="width: 15%"></Column>
                    <Column field="CustomerName" header="Customer" sortable style="width: 15%"></Column>
                    <Column field="DeliveryDate" header="Delivery Date" sortable style="width: 15%;"></Column>
                    <Column field="Status" header="Status" sortable style="width: 20%;  text-align: center;">
                        <template #body="{ data }">
                            <Tag :value="data.Status.StatusName"
                                :style="{ border: data.Status.StatusBorderColor, backgroundColor: data.Status.StatusBgColor, color: data.Status.StatusFontColor, fontSize: data.Status.StatusFontSize }" />
                        </template>
                    </Column>
                    <Column field="OrderQuantity" header="Order Qty" sortable style="width: 1%"></Column>
                    <Column field="PickQuantity" header="Pick Qty" sortable style="width: 10%"></Column>
                    <Column field="ShipQuantity" header="Ship Qty" sortable style="width: 10%"></Column>
                    <Column field="PickQuantity - ShipQuantity" header="Balance" sortable style="width: 10%"></Column>
                    <Column field="TotalAmount" header="Total Amount" sortable style="width: 15%"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import SalesOrderService from '@/service/SalesOrderService'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';

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
const dropdownVisible: Ref<Record<string, boolean>> = ref({});
const loading = ref(false);
const fetchLoading = ref(true);
const error = ref(false);
const menu = ref<InstanceType<typeof Menu> | null>(null);
const isPanelVisible = ref(false);
const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
});
const dates = ref();

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

const TAKING = 1;
const APPROVED = 200;
const CANCELLED = 2000;

const sortedItems = computed(() => {
    return items.value
})

const toggleMenu = (event: Event) => {
    menu.value?.toggle(event);
};

const onPageChange = (event: { first: number, rows: number, page: number }) => {
    // Update state   
    currentPage.value = event.page;
    pageSize.value = event.rows;
    // Handle data loading for the new page (pagination)
    fetchData();
}

const togglePanel = () => {
    isPanelVisible.value = !isPanelVisible.value; // Toggle the visibility
}

const fetchData = async () => {
    try {
        fetchLoading.value = true;
        const response = await SalesOrderService.search(`${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`)
        console.log('Search result:', response);
        items.value = response.Data
        totalRecords.value = response.Pagination.TotalRecords
        totalPages.value = response.Pagination.TotalPages
        fetchLoading.value = false;
    } catch (error) {
        console.error('Error fetching data:', error)
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

const toggleDropdown = (data: { SalesOrderID: number; }) => {
    dropdownVisible.value[data.SalesOrderID] = !dropdownVisible.value[data.SalesOrderID];
};

const closeDropdown = (data: { SalesOrderID: number; }) => {
    dropdownVisible.value[data.SalesOrderID] = false;
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

    loading.value = true;
    fetchData()

    loading.value = false;
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
