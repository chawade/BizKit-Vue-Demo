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
                <h4 class="font-bold text-l flex gap-2 items-center"><span class="pi pi-cog"></span>Stock Taking</h4>
                <router-link to="/StockTaking/Maintain/">
                    <Button icon="pi pi-plus-circle" label="Create Stock Taking" severity="success" />
                </router-link>
            </div>

            <div class="table-scrollable table-list">
                <ItemTable :items="sortedItems" :columns="columns" :dataKey="'takingId'" scrollable
                    scroll-height="400px" :rows-per-page="pageSize" :pageIdentifier="'StockTaking'"
                    :rowsPerPageOptions="[5, 10, 25]" :selection="selectedItems" :loading="fetchLoading" :lazy="true"
                    :totalRecords="totalRecords" @page="onPageChange" @update:selection="onRowSelect" @sort="onSort"
                    @search="fetchData" :menu="actions">
                    <template #header>
                        <Menubar :model="filteredMenuItems" class="hidden md:flex">
                            <template #start>
                                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined
                                    @click="clearSearch" />
                            </template>
                            <template #end>
                                <IconField>
                                    <InputGroup>
                                        <InputText v-model="searchString" placeholder="Search..." />
                                        <Button icon="pi pi-search" severity="info" @click="search" />
                                    </InputGroup>
                                </IconField>
                            </template>
                        </Menubar>
                    </template>

                    <template #takingNo="slotProps">
                        <RouterLink :to="`/StockTaking/Detail/${slotProps.data.takingId}`" custom v-slot="{ navigate }">
                            <Button :label="slotProps.data.takingNo" link @click="navigate" class="p-0" />
                        </RouterLink>
                    </template>

                    <template #takingDate="slotProps">
                        {{ new Date(slotProps.data.takingDate).toLocaleDateString() }}
                    </template>

                    <template #status="slotProps">
                        <Tag class="min-w-28 max-w-28 text-wrap" :value="slotProps.data.status.statusName" :style="{
                            backgroundColor: statusTheme(slotProps.data.status.statusId).bgColor,
                            border: `1px solid ${statusTheme(slotProps.data.status.statusId).borderColor}`,
                            color: statusTheme(slotProps.data.status.statusId).fontColor,
                            fontSize: statusTheme(slotProps.data.status.statusId).fontSize
                        }" />
                    </template>

                </ItemTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, type Ref, reactive, onUnmounted } from 'vue'
import stockTakingService from '@/service/stockTakingService';
import type { stockTakingHeaderList } from '@/Model/stockTaking';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Subscription } from 'rxjs';
import ItemTable from '@/components/ItemTable.vue';
import type { DataTablePageEvent } from 'primevue/datatable';
import type { ColumnDef } from '@/Model/GlobalVariable/DataTable';
import StatusService from '@/service/statusService';
import { useDataTableStore } from '@/store/useDataTableStore';

let subscription: Subscription;
const statusService = new StatusService();
const toast = useToast();
const isSelectAll = ref(false);
const router = useRouter();
const dataTableStore = useDataTableStore();
const items = ref<stockTakingHeaderList[]>([]);
const currentPage = ref(1)
const pageSize = ref(10)
const searchString = ref('')
const sortKey = ref('takingNo')
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

const actions = ref([
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
    const sortField: string = event.sortField;
    const Key: number = event.sortOrder;
    switch (Key) {
        case 1:
            sortOrder.value = 'ASC';
            break;
        default:
            sortOrder.value = 'DESC';
            break;
    }

    switch (sortField) {
        case 'takingNo':
            sortKey.value = 'takingNo';
            break;
        case 'takingDate':
            sortKey.value = 'takingDate';
            break;
        case 'warehouse':
            sortKey.value = 'warehouse';
            break;
        case 'location':
            sortKey.value = 'location';
            break;
        case 'personInCharge':
            sortKey.value = 'personInCharge';
            break;
        case 'Status':
            sortKey.value = 'Status';
            break;
        default:
            sortKey.value = 'takingDate';
            break;
    }
    fetchData();
};


const columns = ref<ColumnDef[]>([
    { field: 'takingNo', header: 'Taking No', sortable: true, class: 'text-left; width: fit-content;', headerClass: 'w-full min-w-36 text-center font-bold' },
    { field: 'takingDate', header: 'Taking Date', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold' },
    { field: 'warehouseName', header: 'Warehouse', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold' },
    { field: 'locationName', header: 'Location', sortable: true, class: 'width: 15%', headerClass: 'w-full min-w-36 text-center font-bold' },
    { field: 'personInCharge', header: 'Person In Charge', sortable: true, class: 'width: 20%; text-align: center;', headerClass: 'w-full min-w-20 text-center font-bold' },
    { field: 'status', header: 'Status', sortable: true, class: 'width: 20%; text-align: center;', headerClass: 'w-full min-w-36 text-center font-bold' }
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
const statusTheme = (statusId: number) => {
    return statusService.getStatusTheme(statusId)
}
const sortedItems = computed(() => {
    return items.value
})

const onPageChange = (event: DataTablePageEvent) => {
    currentPage.value = event.page + 1;
    pageSize.value = event.rows;
    fetchData();
}

const clearSearch = () => {
    currentPage.value = 1
    pageSize.value = 10
    sortKey.value = 'takingDate'
    sortOrder.value = 'DESC'
    searchString.value = ''
    fetchData()
}

const fetchData = () => {
    fetchLoading.value = true;
    const endpoint = `${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`;
    subscription = stockTakingService.search(endpoint).subscribe({
        next: (result) => {
            if (result.isSuccess) {
                items.value = result.data || [];
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
            fetchLoading.value = false;
        }
    });
}

const filteredMenuItems = computed(() => {
    return nestedMenuitems.value.filter(item => {
        if (item.label === 'Approve' || item.label === 'Generate Invoice' || item.label === 'Print') {
            return selectedItems.value.length > 0;
        }
        return true;
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

onUnmounted(() => {
    subscription.unsubscribe();
})

watch(selectedItems, (newSelectedItems) => {

});

</script>