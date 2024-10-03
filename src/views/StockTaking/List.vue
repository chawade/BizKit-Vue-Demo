<template>
    <div>
        <h3 class="font-bold text-xl mb-8">Stock Taking</h3>
    </div>
    <Breadcrumb :model="path" class="card">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="[item.icon, 'text-color']" />
                    <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
            </a>
        </template>
    </Breadcrumb>
    <div class="card">
        <div class="row">
            <div class="col-sm-8">
                <span>Stock Taking</span>
            </div>
            <div class="col-sm-4 text-right">
                <router-link to="/StockTaking/Maintain/0">
                    <Button label=" Create Stock Taking" severity="success" />
                </router-link>
            </div>
            <div class="col-sm-8">
                <Button label="Approve" severity="info" @click="approves" />
                <Button label="ExportCSV" severity="info" />
                <!-- <Button label="ExportExcel" severity="info" /> -->
            </div>
            <div class="col-sm-4 text-right">
                <div class="table-group-actions pull-right">
                    <span class="input-group-btn" style="display: inline-table; margin-left: 3px">
                        <InputText type="text" style="font-size:12px;" :placeholder="('Stock Taking')"
                            class="form-control input-inline" v-model="searchString" @click="collapsed"
                            maxlength="100" />
                        <span class="input-group-btn">
                            <Button icon="pi pi-search" severity="info" @click="search" />
                        </span>
                        <!-- <a id="lblSearch" style="font-weight:bold;color:#1c9dd8" @click="toggleSearchPanel">
                            <i class="fa fa-bars" :class="{ 'rotate': isPanelOpen }"></i>
                        </a> -->
                    </span>
                </div>
            </div>
        </div>
        <div id="pnlsearch" class="collapse row border border-default" v-show="isPanelOpen">
            <!-- Search panel fields go here -->
        </div>

        <DataTable v-model:selection="selected" :value="sortedItems" :rows="10" dataKey="id" :paginator="true"
            :filters="sortedItems"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
            >
            <Column header="">
                <template #body="{ data }">
                    <div class="dropdown" @mouseleave="closeDropdown(data)">
                        <Button icon="pi pi-cog" class="p-button-text" @click="toggleDropdown(data)"
                            aria-label="Menu" />
                        <div v-if="dropdownVisible[data.TakingId]" class="dropdown-menu">
                            <ul class="dropdown-list">
                                <li @click="handleAction(data, 'view')">{{ 'Detail' }}</li>
                                <li v-if="permission.MODIFY && data.StatusCode !== TAKING && data.StatusCode < APPROVED"
                                    @click="handleAction(data, 'edit')">{{ 'Edit' }}</li>
                                <li v-if="permission.MODIFY" @click="handleAction(data, 'copy')">{{ 'Copy' }}</li>
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
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="TakingNo" header="TakingNo" sortable style="width: 25%">
                <template #body="{ data }">
                    <a :href="`/StockTaking/Detail/${data.TakingId}`" class="docno-link">{{ data.TakingNo }}</a>
                </template>
            </Column>
            <Column field="TakingDate" header="TakingDate" sortable style="width: 25%">
                <template #body="{ data }">
                    {{ formatDate(data.TakingDate) }}
                </template>
            </Column>
            <Column field="WarehouseName" header="WarehouseName" sortable style="width: 25%"></Column>
            <Column field="LocationName" header="LocationName" sortable style="width: 25%"></Column>
            <Column field="PersonInCharge" header="PersonInCharge" sortable style="width: 25em;"></Column>
            <Column field="Status.StatusName" header="Status" sortable>
                <template #body="slotProps">
                    <span class="status" :style="{
                        display: 'inline-block',
                        backgroundColor: slotProps.data.Status.StatusBgColor,
                        borderColor: slotProps.data.Status.StatusBorderColor,
                        fontSize: slotProps.data.Status.StatusFontSize + 'px',
                        color: slotProps.data.Status.StatusFontColor
                    }">
                        {{ slotProps.data.Status.StatusName }}
                    </span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import { StockTakingService } from '@/Service/stockTakingService'

import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

interface Status {
    StatusId: number;
    StatusName: string;
    StatusBgColor: string;
    StatusBorderColor: string;
    StatusFontColor: string;
    StatusFontSize: number;
}

interface Item {
    TakingId: Number,
    TakingNo: string;
    WarehouseName: string;
    PersonInCharge: string;
    Status: Status;
    TakingDate: string;
    LocationName: string | null;
}

const route = useRoute();
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
const selected = ref();
const dropdownVisible: Ref<Record<string, boolean>> = ref({});

const permission = ref({
    APPROVE: true,
    EXPORT: true,
    MODIFY: true,
    PRINT: true
});

const TAKING = 1;
const APPROVED = 200;
const CANCELLED = 2000;

const path = computed(() => {
    const breadcrumbItems: any[] = [];

    breadcrumbItems.push({ icon: 'pi pi-home', route: '/' });

    route.matched.forEach((matchedRoute) => {
        if (matchedRoute.meta.module) {
            breadcrumbItems.push({
                label: matchedRoute.meta.module
            });
        }
        if (matchedRoute.meta.breadcrumb) {
            breadcrumbItems.push({
                label: matchedRoute.meta.breadcrumb,
                route: matchedRoute.path
            });
        }
    });

    return breadcrumbItems;
});

const view = (takingId: number) => {
    console.log('View', takingId);
};

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

const sortedItems = computed(() => {
    return items.value
})

const handleAction = (data: { TakingId: any; TakingDateEn: any; }, action: any) => {
    switch (action) {
        case 'view':
            view(data.TakingId);
            break;
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

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
};

const fetchData = async () => {
    try {
        const response = await StockTakingService.search(`${currentPage.value}/${pageSize.value}/${sortKey.value}/${sortOrder.value}/${searchString.value}`)
        console.log(response.Data)
        items.value = response.Data
        totalRecords.value = response.Pagination.TotalRecords
        totalPages.value = response.Pagination.TotalPages
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

// const sortBy = (key) => {
//     if (key === sortKey.value) {
//         sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
//     } else {
//         sortKey.value = key
//         sortOrder.value = 'DESC'
//     }
//     fetchData()
// }

// const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages.value) {
//         currentPage.value = page
//         fetchData()
//     }
// }

const search = () => {
    currentPage.value = 1
    
    fetchData()
}

// const toggleSearchPanel = () => {
//     isPanelOpen.value = !isPanelOpen.value
// }

// const toggleAll = () => {
//     items.value.forEach(item => item.selected = selectAll.value)
// }

onMounted(() => {
    fetchData()
})

// watch(searchString, () => {
//     search()
// })

</script>

<style scoped>
.dropdown {
    position: relative;
    display: inline-block;
    /* Align the dropdown */
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    /* Position below the button */
    left: 0;
    /* Align to the left of the button */
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    /* Ensure it is on top */
}

.dropdown-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.dropdown-list li {
    padding: 10px 15px;
    /* Space around each item */
    cursor: pointer;
}

.dropdown-list li:hover {
    background-color: #f0f0f0;
    /* Change background on hover */
}

.text-danger {
    color: red;
    /* Style for Cancel item */
}

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
