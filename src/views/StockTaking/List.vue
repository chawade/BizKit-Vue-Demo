// StockTakingList.vue
<template>
    <div v-if="error">{{ error }}</div>
    <div v-else>
        <div class="card">
            <div class="col-sm-8 flex justify-between mb-8">
                <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Stock Taking</h4>
                <router-link to="/StockTaking/Maintain/">
                    <Button icon="pi pi-plus-circle" label="Create Stock Taking" severity="success" />
                </router-link>
            </div>

            <!-- Action buttons and search -->
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
                <ItemTable 
                    :data="sortedItems" 
                    :columns="columns" 
                    tableStyle="min-width: 50rem" 
                    :selectable="true"
                    v-model:selectedItems="selectedItems" 
                    @rowSelect="onRowSelect" 
                    @rowUnselect="onRowUnselect"
                    :rows="10" 
                    scrollHeight="400px" 
                    dataKey="TakingId">
                    <template #header>
                        <Column header="">
                            <template #body="{ data }">
                                <!-- <DropdownMenu :data="data" :permission="permission" @action="handleAction" /> -->
                            </template>
                        </Column>
                    </template>
                    <template #TakingNo="{ data }">
                        <router-link :to="`/StockTaking/Detail/${data.TakingId}`" custom v-slot="{ navigate }">
                            <Button :label="data.TakingNo" link @click="navigate" class="p-0" />
                        </router-link>
                    </template>
                    <template #Status="{ data }">
                        <!-- <StatusBadge :status="data.Status" @click="sortBy(data.Status.StatusName)" /> -->
                    </template>
                </ItemTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import StockTakingService from '@/service/stockTakingService';
import ItemTable from '@/components/ItemTable.vue';
import { firstValueFrom } from 'rxjs';

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
const loading = ref<boolean>(false);
const error = ref(false);
const router = useRouter();
const route = useRoute();

const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
});

const sortedItems = computed(() => {
    return items.value
})

const columns = [
    { field: 'TakingNo', header: 'Taking No', sortable: true, customBody: true },
    { field: 'TakingDate', header: 'Taking Date', sortable: true },
    { field: 'WarehouseName', header: 'Warehouse', sortable: true },
    { field: 'LocationName', header: 'Location', sortable: true },
    { field: 'PersonInCharge', header: 'Person In Charge', sortable: true },
    { field: 'Status', header: 'Status', customBody: true }
];


const fetchData = async () => {
  try {
    const response = await firstValueFrom(
      StockTakingService.search(`${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`)
    );
    
    console.log('Search result:', response);
    items.value = response.Data;
    totalRecords.value = response.Pagination.TotalRecords;
    totalPages.value = response.Pagination.TotalPages;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const approves = async (docIds: number[]) => {
  try {
    const response = await firstValueFrom(StockTakingService.approves(docIds));
    console.log('Approved stock taking:', response);
  } catch (error) {
    console.error('Error approving stock taking:', error);
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

const handleAction = (data: any, action: string) => {
    switch (action) {
        case 'detail':
            router.push(`/StockTaking/Detail/${data.TakingId}`);
            break;
        case 'edit':
            break;
        case 'copy':
            break;
        case 'print':
            break;
        case 'cancel':
            break;
    }
};

const onRowSelect = (data: any) => {
    const takingId = data.TakingId;
    if (!selectedTakingIds.value.includes(takingId)) {
        selectedTakingIds.value.push(takingId);
    }
};

const onRowUnselect = (data: any) => {
    const takingId = data.TakingId;
    const index = selectedTakingIds.value.indexOf(takingId);
    if (index > -1) {
        selectedTakingIds.value.splice(index, 1);
    }
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
    fetchData();
});

watch(selectedItems, (newSelectedItems) => {
    selectedTakingIds.value = newSelectedItems.map((item: any) => item.TakingId);
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
