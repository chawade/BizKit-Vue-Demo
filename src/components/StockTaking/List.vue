<template>
    <div>
        <div class="row">
            <div class="col-sm-8">
                <a v-if="permission.APPROVE" @click="approve" id="btnApprove"
                    class="btn btn-transparent blue btn-outline">
                    <i class="fa fa-check-circle"></i> {{ ('Approve') }}
                </a>
                <div v-if="permission.EXPORT" class="btn-group" role="group">
                    <a id="btnExpToCsv" title="Export to csv file" class="btn btn-transparent blue btn-outline"
                        @click="exportToCSV">
                        <i class="fa fa-file-text"></i> {{ ('ExportCSV') }}
                    </a>
                    <a id="btnExpToExcel" title="Export to Excel file" class="btn btn-transparent blue btn-outline"
                        @click="exportToExcel">
                        <i class="fa fa-file-excel-o"></i> {{ ('ExportExcel') }}
                    </a>
                </div>
            </div>
            <div class="col-sm-4 text-right">
                <div class="table-group-actions pull-right">
                    <span class="input-group-btn" style="display: inline-table; margin-left: 3px">
                        <input type="text" style="font-size:12px;" :placeholder="('StockTaking.StockTaking')"
                            class="form-control input-inline" v-model="searchString" @click="collapsed"
                            maxlength="100" />
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

        <div class="row">
            <div class="table-scrollable table-list">
                <table class="table table-hover table-striped" id="tableTakingList" cellspacing="0" border="0">
                    <thead>
                        <tr>
                            <th width="5px">&nbsp;</th>
                            <th class="text-center" width="5px" style="color:#5b9bd1;">
                                <input type="checkbox" id="checkAll" v-model="selectAll" @change="toggleAll" />
                            </th>
                            <th v-for="header in tableHeaders" :key="header.key" :width="header.width"
                                style="text-align:center;color:#5b9bd1;">
                                <a @click="sortBy(header.key)">
                                    {{ (`${header.label}`) }}
                                    <span v-if="sortKey === header.key"
                                        :class="sortOrder === 'asc' ? 'fa fa-sort-asc' : 'fa fa-sort-desc'"></span>
                                </a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in sortedItems" :key="item.TakingId"
                            style="height:50px;border-bottom: 1px solid #F6F6F6;">
                            <td style="width:5px">
                                <input type="hidden" class="TakingDate" :value="item.TakingDateEn" />
                                <div class="dropdown list-action">
                                    <a class="btn dropdown-toggle" style="font-size: 18px; color: #666"
                                        href="javascript:;" data-toggle="dropdown" data-hover="dropdown"
                                        data-close-others="true">
                                        <i class="fa fa-cog"></i>
                                    </a>
                                    <ul class="dropdown-menu" role="menu" aria-labelledby="btnActions">
                                        <li @click="view(item.TakingId)"><a> {{ ('StockTaking.Detail') }}</a>
                                        </li>
                                        <li v-if="permission.MODIFY && item.StatusCode !== TAKING && item.StatusCode < APPROVED"
                                            @click="edit(item.TakingId)">
                                            <a> {{
                                                ('StockTaking.Edit') }}</a>
                                        </li>
                                        <li v-if="permission.MODIFY" @click="copy(item.TakingId)">
                                            <a>{{
                                                ('StockTaking.Copy') }}</a>
                                        </li>
                                        <li v-if="permission.PRINT && item.StatusCode !== CANCELLED"
                                            @click="print(item.TakingId)">
                                            <a target="_blank"> {{
                                                ('PurchaseRequest.btnPrint') }}</a>
                                        </li>
                                        <li v-if="permission.MODIFY && item.StatusCode < APPROVED" class="divider"></li>
                                        <li v-if="permission.MODIFY && item.StatusCode < APPROVED"
                                            @click="cancel(item.TakingId, item.TakingDateEn)">
                                            <a><span class="text-danger"><i class="fa fa-trash-o"
                                                        style="font-size:20px"></i> {{ ('StockTaking.Cancel')
                                                    }}</span></a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                            <td class="text-center">
                                <input type="checkbox" class="check" v-model="item.selected" />
                                <input type="hidden" class="tkId" :value="item.TakingId" />
                            </td>
                            <td v-for="header in tableHeaders" :key="header.key" style="text-align:center">
                                <template v-if="header.key === 'TakingNo'">
                                    <a :href="`/StockTaking/Detail/${item.TakingId}`" class="docno-link">{{ item[header.key] }}</a>
                                </template>
                                <template v-else-if="header.key === 'StatusName'">
                                    <span class="status label label-sm" :style="{
                                        display: 'inline-block',
                                        backgroundColor: item.Status.StatusBgColor,
                                        borderColor: item.Status.StatusBorderColor,
                                        fontSize: item.Status.StatusFontSize + 'px',
                                        color: item.Status.StatusFontColor
                                    }">
                                        {{ item.Status.StatusName }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ item[header.key] }}
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 col-sm-12">
                <div class="dataTables_wrapper dataTables_paginate paging_bootstrap_extended pull-right">
                    <div class="pagination">
                        <div id="Pagging">
                            <a @click="goToPage(1)" :class="{ 'disabled': currentPage === 1 }"
                                class="btn default prev">&lt;&lt;</a>
                            <a @click="goToPage(currentPage - 1)" :class="{ 'disabled': currentPage === 1 }"
                                class="btn default prev">&lt;</a>
                            <span class="page">{{ currentPage }} / {{ totalPages }}</span>
                            <a @click="goToPage(currentPage + 1)" :class="{ 'disabled': currentPage === totalPages }"
                                class="btn default next">&gt;</a>
                            <a @click="goToPage(totalPages)" :class="{ 'disabled': currentPage === totalPages }"
                                class="btn default next">&gt;&gt;</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
// import {authService} from '@/Service/authService.js';
import { StockTakingService } from '@/Service/stockTakingService.js'

// import { useI18n } from 'vue-i18n'
import axios from 'axios'

export default {
    name: 'StockTakingList',
    setup() {
        // const { t } = useI18n()

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
                // console.log('Search result:', response);
                items.value = response.Data
                totalRecords.value = response.Pagination.TotalRecords
                totalPages.value = response.Pagination.TotalPages
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        const sortBy = (key) => {
            if (key === sortKey.value) {
                sortOrder.value = sortOrder.value === 'ASC' ? 'DESC' : 'ASC'
            } else {
                sortKey.value = key
                sortOrder.value = 'DESC'
            }
            fetchData()
        }

        const goToPage = (page) => {
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

        return {
            items,
            sortedItems,
            currentPage,
            totalPages,
            pageSize,
            searchString,
            sortKey,
            sortOrder,
            isPanelOpen,
            selectAll,
            totalRecords,
            permission,
            TAKING,
            APPROVED,
            CANCELLED,
            tableHeaders,
            sortBy,
            goToPage,
            search,
            toggleSearchPanel,
            toggleAll,
        }
    }
}
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
