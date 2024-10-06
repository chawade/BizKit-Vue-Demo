<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <div class="card">
            <div class="col-sm-8 flex justify-between mb-8">
                <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Stock Taking</h4>
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
                                    <InputText v-model="searchString" class="w-full" type="text" size="small"
                                        placeholder="TakingNo, Warehouse" />
                                    <Button icon="pi pi-search" severity="info" @click="search" />
                                </InputGroup>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="table-scrollable table-list">
                <DataTable v-model:selection="selectedItems" :value="sortedItems" :rows="10" dataKey="TakingId"
                    :paginator="true" :rowsPerPageOptions="[5, 10, 25]" scrollable scrollHeight="400px"
                    tableStyle="min-width: 50rem" @row-select="onRowSelect" @row-unselect="onRowUnselect">
                    <Column header="">
                        <template #body="{ data }">
                            <div class="dropdown" @mouseleave="closeDropdown(data)">
                                <Button icon="pi pi-cog" class="p-button-text" @click="toggleDropdown(data)"
                                    aria-label="Menu" />
                                <div v-if="dropdownVisible[data.TakingId]" class="dropdown-menu">
                                    <ul class="dropdown-list">
                                        <li><router-link :to="`/StockTaking/Detail/${data.TakingId}`">{{ 'Detail'
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
                    <Column field="TakingNo" header="TakingNo" sortable style="width: 15%">
                        <template #body="{ data }">
                            <router-link :to="`/StockTaking/Detail/${data.TakingId}`" custom v-slot="{ navigate }">
                                <Button :label="data.TakingNo" link @click="navigate" class="p-0" />
                            </router-link>
                        </template>
                    </Column>
                    <Column field="TakingDate" header="TakingDate" sortable style="width: 20%"></Column>
                    <Column field="WarehouseName" header="Warehouse" sortable style="width: 20%"></Column>
                    <Column field="LocationName" header="Location" sortable style="width: 20%"></Column>
                    <Column field="PersonInCharge" header="Person In Charge" sortable style="width: 20%"></Column>
                    <Column field="Status" header="Status" style="width: 15%;">
                        <template #body="slotProps">
                            <span @click="sortBy(slotProps.data.Status.StatusName)" :style="{
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
                            <i :class="sortOrder === 'asc' ? 'fa fa-sort-asc' : 'fa fa-sort-desc'"
                                style="margin-left: 8px;"></i>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import type { Ref } from 'vue';
import StockTakingService from '@/Service/stockTakingService'

const items = ref([])
const currentPage = ref<number>(1)
const totalPages = ref<number>(1)
const pageSize = ref<number>(0)
const searchString = ref<string>('')
const sortKey = ref<string>('TakingNo')
const sortOrder = ref<string>('DESC')
const totalRecords = ref<number>(0)
const selectedItems = ref<number[]>([]);
const selectedTakingIds = ref<number[]>([]);
const dropdownVisible: Ref<Record<string, boolean>> = ref({});
const loading = ref<boolean>(false);
const error = ref(false);

const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
});

const TAKING = 175;
const APPROVED = 200;
const CANCELLED = 2000;

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

const approves = async () => {
    try {
        loading.value = true;
        await StockTakingService.approves(selectedTakingIds.value);
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

const toggleDropdown = (data: { TakingId: number; }) => {
    dropdownVisible.value[data.TakingId] = !dropdownVisible.value[data.TakingId];
};

const closeDropdown = (data: { TakingId: number; }) => {
    dropdownVisible.value[data.TakingId] = false;
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

const sortBy = (key: string) => {
    console.log('Sort by:', sortKey.value);
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
