<template>
  <h1 class="title">Purchase Request List</h1>
  <div class="breadcrumb">
    <p>Home > Purchase > Purchase Request List</p>
  </div>
  <div class="container-full">
    <div class="row">
      <div class="col-12">
        <!-- <input type="hidden" v-model="sort" />
        <input type="hidden" v-model="pagesize" /> -->

        <div class="portlet light portlet-fit portlet-datatable">
          <div class="portlet-title">
            <div class="caption">
              <i class="pi pi-cog" style="font-size: 1rem"></i>
              <span
                class="caption-subject font-green sbold uppercase"
                style="margin-left: 10px"
                >PURCHASE REQUEST LIST</span
              >
            </div>
            <div class="actions">
              <button class="bz-createbtn" @click="fetchPurchaseRequests">
                <i class="pi pi-plus-circle"></i>&nbsp;
                <span id="btnNewPRResource">New Purchase Request</span>
              </button>
            </div>
          </div>

          <hr class="divider" />

          <div class="actions csv-action">
            <button class="bz-exportbtn" @click="exportToCsv">
              <i class="pi pi-file"></i>&nbsp;
              <span>Export to CSV</span>
            </button>
            <button class="bz-exportbtn" @click="exportToExcel">
              <i class="pi pi-file-excel"></i>&nbsp;
              <span>Export to Excel</span>
            </button>
            <div class="search-container">
              <input
                type="text"
                v-model="search"
                placeholder="Request No., Vendor Name, Status"
                class="search-input"
              />
              <button class="bz-searchbtn" @click="searchPurchaseRequests">
                <i class="pi pi-search"></i>&nbsp;
                <span>Search</span>
              </button>
              <button class="bz-detailsearch" @click="detailSearch">
                <i class="pi pi-bars"></i>&nbsp;
              </button>
            </div>
          </div>

          <table class="purchase-request-table">
            <thead>
              <tr>
                <th><i class="pi pi-table" style="color: slateblue"></i></th>
                <th>
                  <input
                    type="checkbox"
                    class="checkbox"
                    @change="toggleAll($event)"
                  />
                </th>
                <th>PRNo.</th>
                <th>PR Date</th>
                <th>Require Date</th>
                <th>Vendor</th>
                <th>Project</th>
                <th>Department</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="request in purchaseRequests"
                :key="request.PurchaseRequestNo"
              >
                <td><i class="pi pi-cog" style="font-size: 1rem"></i></td>
                <td>
                  <input
                    type="checkbox"
                    class="checkbox"
                    v-model="request.selected"
                  />
                </td>
                <td>{{ request.PurchaseRequestNo }}</td>
                <td>{{ request.PurchaseRequestDate }}</td>
                <td>{{ request.RequireDate }}</td>
                <td>{{ request.Vendor?.VendorName || "" }}</td>
                <td>{{ request.Project }}</td>
                <td>{{ request.Department }}</td>
                <td>
                  <span
                    :class="['status-badge', getStatusClass(request.Status)]"
                    :style="{
                      display: 'inline-block',
                      backgroundColor: request.Status.StatusBgColor,
                      borderColor: request.Status.StatusBorderColor,
                      fontSize: request.Status.StatusFontSize + 'px',
                      color: request.Status.StatusFontColor,
                    }"
                    >{{ request.Status?.StatusName || "" }}</span
                  >
                </td>
                <td>{{ request.Amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12 col-sm-12">
      <div class="dataTables_wrapper dataTables_paginate paging_bootstrap_extended pull-right">
        <div class="pagination">
          <div id="Pagging">
            <a @click="goToPage(1)" :class="{ 'disabled': pageNumber === 1 }" class="btn default prev">&lt;&lt;</a>
            <a @click="goToPage(pageNumber - 1)" :class="{ 'disabled': pageNumber === 1 }" class="btn default prev">&lt;</a>
            <span class="page">{{ pageNumber }} / {{ totalPages }}</span>
            <a @click="goToPage(pageNumber + 1)" :class="{ 'disabled': pageNumber === totalPages }" class="btn default next">&gt;</a>
            <a @click="goToPage(totalPages)" :class="{ 'disabled': pageNumber === totalPages }" class="btn default next">&gt;&gt;</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import authService from "@/service/authService";

interface Vendor {
  VendorId: number;
  CompanyId: number;
  VendorCode: string | null;
  VendorName: string;
}

interface Status {
  StatusId: number;
  StatusName: string;
  LocalStatusName: string | null;
  StatusBgColor: string;
  StatusBorderColor: string;
  StatusFontColor: string;
  StatusFontSize: number;
}

interface PurchaseRequest {
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  Vendor: Vendor | null;
  Project: string;
  Department: string;
  Status: Status;
  Amount: number;
  selected?: boolean;
  Pagination: Pagination;
}

interface Pagination {
  TotalRecords: number;
  TotalPages: number;
}
// กำหนดประเภทของ purchaseRequests
const purchaseRequests = ref<PurchaseRequest[]>([]);
const searchParams = reactive({
  PRNo: "",
  Status: null as string | null,
  Vendor: null as string | null,
  PeriodFrom: "",
  PeriodTo: "",
  DeliveryDateFrom: "",
  DeliveryDateTo: "",
  Remark: "",
  ItemCode: "",
  ItemName: "",
  ReferenceNo: "",
  TotalFrom: null as number | null,
  TotalTo: null as number | null,
  CompanyID: null as number | null,
});

const totalPages = ref(1);
const totalRecords = ref(0);
const loading = ref(true);
const error = ref(null);
const search = ref(""); // ตัวแปรการค้นหา
const pageNumber = ref(1);
const pageSize = ref(10); // ตัวแปรขนาดหน้า
const sortBy = ref("PRDate"); // ตัวแปรการจัดเรียง
const direction = ref("DESC"); // ตัวแปรลำดับการจัดเรียง

// ฟังก์ชันดึงข้อมูลจาก API
const fetchPurchaseRequests = async () => {
  try {
    loading.value = true;
    const axiosInstance = await authService.getAuthenticatedAxiosInstance();

    // ส่งพารามิเตอร์ไปที่ API ตามโครงสร้างของ Controller
    const response = await axiosInstance.get(
      `http://localhost:3692/api/v1/purchaserequest/${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${search.value}`
    );

    purchaseRequests.value = response.data.Data; // รับข้อมูล Data จาก response
    console.log(purchaseRequests.value);
    totalRecords.value = response.data.Pagination.TotalRecords
    totalPages.value = response.data.Pagination.TotalPages
  } catch (err) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    pageNumber.value = page;
    fetchPurchaseRequests();
    console.log(page);
  }
};
const exportToCsv = async () => {
  // ส่งคำสั่งส่งออกไปยัง API เพื่อส่งข้อมูลไปยัง����ลเดอร์ CSV
};

const exportToExcel = async () => {
  // ส่งคำสั่งส่งออกไปยัง API เพื่อส่งข้อมูลไปยัง Excel
};

const detailSearch = async () => {};

const searchPurchaseRequests = () => {
  pageNumber.value = 1; // Reset to first page when searching
  fetchPurchaseRequests(); // Call with true for detailed search
};

watch(search, () => {
  // เรียกค้นหาข้อมูลเมื่อมีการกรอกอย่างน้อย 3 ตัวอักษร หรือเมื่อเคลียร์ข้อมูล
  if (search.value.length >= 1 || search.value.length === 0) {
    searchPurchaseRequests(); // เรียกค้นหาข้อมูล
  }
});

const toggleAll = (event) => {
  const checked = event.target.checked;
  purchaseRequests.value.forEach((request) => {
    request.selected = checked;
  });
};

// ฟังก์ชันกำหนดคลาสสถานะ
const getStatusClass = (status) => {
  switch (status) {
    case "Approved":
      return "bg-success"; // สีเขียวสำหรับ Approved
    case "Draft":
      return "bg-warning"; // สีเหลืองสำหรับ Draft
    case "Rejected":
      return "bg-danger"; // สีแดงสำหรับ Rejected
    default:
      return "bg-info"; // สีฟ้าสำหรับสถานะอื่น ๆ
  }
};

// เรียกใช้ฟังก์ชันเมื่อ component ถูกสร้างขึ้น
onMounted(fetchPurchaseRequests);
</script>

<style scoped>
.container-full {
  width: 100vw;
  height: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.breadcrumb {
  width: 100vw;
  height: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 20px;
  font-size: 14px;
  color: gray;
}

.title {
  text-align: left;
  font-size: 2em;
  color: #0d0d0d;
  padding: 20px;
}

.search-container {
  display: flex;
  align-items: center;
  margin-left: 55%;
}

.search-input {
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
  font-weight: bold;
}

.bz-searchbtn {
  background-color: #007bff;
  color: white;
  padding: 9px 15px;
  border: none;
  text-decoration: none;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin: 1px;
}
.bz-detailsearch {
  background-color: #007bff;
  color: white;
  padding: 9px 15px;
  border: none;
  text-decoration: none;
  font-size: 15px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin: 1px;
}

.bz-searchbtn:hover {
  background-color: #0056b3;
}

.checkbox {
  transform: scale(1.8);
  margin-left: 34%;
}

.purchase-request-table th,
.purchase-request-table td {
  border: none;
  padding: 8px;
  text-align: left;
  color: #333;
}

.purchase-request-table th {
  background-color: #f2f2f2;
  color: rgb(24, 108, 164);
  font-weight: bold;
}

.purchase-request-table tr {
  border-bottom: 1px solid #ddd;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.csv-action {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.bz-createbtn {
  background-color: #34d059;
  color: white;
  padding: 10px 15px;
  border: none;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
}

.bz-createbtn:hover {
  background-color: #218838;
}

.portlet-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bz-exportbtn {
  background-color: #278ad0;
  color: white;
  padding: 10px 15px;
  border: none;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-left: 0px;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin: 2px;
}

.caption-subject {
  color: rgb(48, 165, 200);
  font-weight: bolder;
  font-size: medium;
}

.divider {
  border: none;
  height: 1px;
  background-color: #ddd;
  margin: 20px 0;
}

.purchase-request-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.bz-exportbtn:hover {
  background-color: #0056b3;
}
.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  color: white; /* สีข้อความ */
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
/* .bg-success {
  background-color: #28a745; 
}

.bg-warning {
  background-color: #ffc107; 
}

.bg-danger {
  background-color: #dc3545; 
}

.bg-info {
  background-color: #17a2b8; 
} */
</style>
