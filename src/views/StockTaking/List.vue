<template>
    <div>
        <div class="row">
            <div class="col-sm-8">
                <!-- <a v-if="permission.APPROVE" @click="approve" id="btnApprove"
                    class="btn btn-transparent blue btn-outline">
                    
                </a>-->
                <div v-if="permission.EXPORT" class="grid gap-2" role="group">
                    <div class="col-span-full lg:col-span-8 flex flex-wrap gap-2">
                        <Button label="Approve" severity="success" class="w-full sm:w-auto" />
                        <Button label="ExportCSV" severity="info" class="w-full sm:w-auto" @click="exportToCSV" />
                        <Button label="ExportExcel" severity="info" class="w-full sm:w-auto" @click="exportToExcel" />
                    </div>

                    <div class="col-span-full lg:col-span-2 mt-2 lg:mt-0 lg:col-start-9">
                        <span class="p-input-icon-right w-full">
                            <InputGroup>
                                <InputText v-model="searchString" class="w-full" type="text" size="medium"
                                    placeholder="TakingNo, Warehouse" />
                                <Button icon="pi pi-search" severity="warn" />
                            </InputGroup>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-sm-4 text-right">
                <div class="table-group-actions pull-right">
                    <span class="input-group-btn" style="display: inline-table; margin-left: 3px">
                        <!-- <input type="text" style="font-size:12px;" :placeholder="('StockTaking.StockTaking')"
                            class="form-control input-inline" v-model="searchString" @click="collapsed"
                            maxlength="100" /> -->


                        <span class="input-group-btn">
                            <a class="btn btn-transparent blue btn-outline" @click="search" id="btnSearch">
                                <i class="fa fa-search"></i>
                            </a>
                        </span>
                        <a id="lblSearch" style="font-weight:bold;color:#1c9dd8" @click="toggleSearchPanel">
                            <i class="fa fa-bars" :class="{ 'rotate': isPanelOpen }"></i>
                        </a>
                    </span>
                </div>
            </div>
        </div>

        <div id="pnlsearch" class="collapse row border border-default" v-show="isPanelOpen">
            <!-- Search panel fields go here -->
        </div>

        <div class="table-scrollable table-list">
            <DataTable v-model:selection="selectedProduct" :value="items" paginator :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem">
                <Column header="No." style="width: 5%">
                    <template #body="{ index }">
                        {{ index + 1 }}
                    </template>
                </Column>
                <Column selectionMode="multiple" headerStyle="width: 3rem" style="width: 5%"></Column>
                <Column field="TakingNo" header="TakingNo" style="width: 15%">
                    <template #body="{ data }">
                        <router-link :to="`/StockTaking/Detail/${data.TakingId}`" custom v-slot="{ navigate }">
                            <Button :label="data.TakingNo" link @click="navigate" class="p-0" />
                        </router-link>
                    </template>
                </Column>
                <Column field="WarehouseName" header="Warehouse" style="width: 20%"></Column>
                <Column field="LocationName" header="Location" style="width: 20%"></Column>
                <Column field="PersonInCharge" header="Person In Charge" style="width: 20%"></Column>
                <Column field="Status" header="Status" style="width: 15%;">
                    <template #body="{ data }">
                        <span :style="{
                            backgroundColor: data.Status.StatusBgColor,
                            color: data.Status.StatusFontColor,
                            border: `1px solid ${data.Status.StatusBorderColor}`,
                            fontSize: `${data.Status.StatusFontSize}px`,
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            display: 'inline-block'
                        }">
                            {{ data.Status.StatusName }}
                        </span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { StockTakingService } from '@/Service/stockTakingService'
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
const sortKey = ref('TakingNo')
const sortOrder = ref('DESC')
const isPanelOpen = ref(false)
const selectAll = ref(false)
const totalRecords = ref(0)
const selectedProduct = ref();
const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
})

const TAKING = 1
const APPROVED = 200
const CANCELLED = 2000

const tableHeaders = [
    { key: 'TakingNo', label: 'TakingNO', width: '120px' },
    { key: 'TakingDate', label: 'TakingDate', width: '120px' },
    { key: 'WarehouseName', label: 'Warehouse', width: '120px' },
    { key: 'LocationName', label: 'Location', width: '120px' },
    { key: 'PersonInCharge', label: 'PIC', width: '120px' },
    { key: 'StatusName', label: 'Status', width: '60px' }
]

const sortedItems = computed(() => {
    return items.value
})

const fetchData = async () => {
    try {
        const response = await StockTakingService.search(`${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`)
        console.log('Search result:', response);
        items.value = response.Data
        totalRecords.value = response.Pagination.TotalRecords
        totalPages.value = response.Pagination.TotalPages
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

const sortBy = (key: any) => {
    if (key === sortKey.value) {
        sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
        sortKey.value = key
        sortOrder.value = 'DESC'
    }
    fetchData()
}

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchData()
    }
}

const search = () => {
    currentPage.value = 1
    fetchData()
}

const toggleSearchPanel = () => {
    isPanelOpen.value = !isPanelOpen.value
}

const toggleAll = () => {
    items.value.forEach(item => item.selected = selectAll.value)
}

onMounted(() => {
    fetchData()
})

watch(searchString, () => {
    search()
})

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

/* Define the default color for all the table rows */
.hoverTable tbody tr {
    background: white;
}

/* Define the hover highlight color for the table row */
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
