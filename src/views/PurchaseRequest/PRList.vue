<template>
  <div class="container">
    <!-- Page Breadcrumb -->
    <ul class="breadcrumb">
      <li><a href="~/dashboard">MenuHomeTitle</a></li>
      <li><a href="~/PurchaseRequest/List">MenuPurchasesTitle</a></li>
      <li>.PRListHeader</li>
    </ul>

    <!-- Header Section -->
    <div class="header d-flex justify-content-between align-items-center">
      <div class="caption">
        <i class="icon-settings font-green"></i>
        <span class="caption-subject font-green sbold uppercase">Purchase Request List</span>
      </div>

      <div class="actions" v-if="permission.MODIFY">
        <a @click="NewPR" id="btnNewPR" class="btn btn-success">
          <i class="pi pi-plus-circle"></i> New Purchase Request
        </a>
      </div>
    </div>

    <!-- Alert Message -->
    <!-- <div id="alertmsg" class="alert alert-danger" v-if="showAlertMsg">
      <button type="button" @click="hideDivMSG" class="close" data-dismiss="alert">&times;</button>
      <span id="lblMsg">Message</span>
    </div> -->

    <!-- Actions Section -->
    <div class="row mb-3">
      <!-- <div class="col-md-8">
        <div v-if="permission.APPROVE || permission.MODIFY || permission.PRINT">
          <button v-if="permission.APPROVE" @click="Approve" class="btn btn-success">
            <i class="pi pi-check-circle"></i> Approve
          </button>
          <button v-if="permission.MODIFY" @click="GeneratePO" class="btn btn-info">
            <i class="pi pi-exchange"></i> ConvertPO
          </button>
          <button v-if="permission.PRINT" @click="PrintList" class="btn btn-info">
            <i class="pi pi-print"></i> Print
          </button>
        </div>
      </div> -->

      <div class="col-md-4 text-right">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Request No., Vendor Name, Status" v-model="searchString" />
          <span class="input-group-btn">
            <button class="btn btn-primary" @click="searchList">
              <i class="pi pi-search"></i> Search
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Search Panel -->
    <div id="pnlsearch" class="collapse border p-3 mb-3">
      <div class="row">
        <div class="col-md-3">
          <label>PRNo</label>
          <InputText type="text" class="form-control" v-model="PRNO" />
        </div>
        <div class="col-md-3">
          <label>Vendor</label>
          <select class="form-control" v-model="vendorID">
            <option v-for="vendor in vendorList" :value="vendor.VendorId">{{ vendor.VendorName }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label>Status</label>
          <select class="form-control" v-model="statusID">
            <option v-for="status in statusList" :value="status.StatusId">{{ status.StatusName }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label>ReferenceNo</label>
          <input type="text" class="form-control" v-model="ReferenceNo" />
        </div>
      </div>

      <!-- Additional Fields -->
      <div class="row mt-3">
        <div class="col-md-3">
          <label>Remark</label>
          <input type="text" class="form-control" v-model="remark" />
        </div>
        <div class="col-md-3">
          <label>ItemCode</label>
          <input type="text" class="form-control" v-model="itemCode" />
        </div>
        <div class="col-md-3">
          <label>ItemName</label>
          <input type="text" class="form-control" v-model="itemName" />
        </div>
      </div>

      <!-- Detailsearch -->
      <div class="row mt-3">
        <div class="col-md-12 text-right">
          <button @click="searchDetails" class="btn btn-primary"><i class="pi pi-bars"></i></button> 
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th><i class="pi pi-table" style="color: slateblue"></i></th>
            <th><input type="checkbox" @change="toggleSelectAll($event)" /></th>
            <th @click="sortData('PRNo')">PRNo</th>
            <th @click="sortData('PRDate')">PRDate</th>
            <th @click="sortData('DeliveryDate')">RequireDate</th>
            <th @click="sortData('VendorName')">Vendor</th>
            <th>Project</th>
            <th>Department</th>
            <th>Status</th>
            <th @click="sortData('TotalAmount')">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="purchaseRequest in request" :key="purchaseRequest.PurchaseRequestNo">
            <td><i class="pi pi-cog" style="font-size: 1rem"></i></td>
            <td><input type="checkbox" v-model="purchaseRequest.selectedItems" /></td>
            <td>{{ purchaseRequest.PurchaseRequestNo }}</td>
            <td>{{ purchaseRequest.PurchaseRequestDate }}</td>
            <td>{{ purchaseRequest.RequireDate }}</td>
            <td>{{ purchaseRequest.Vendor?.VendorName || '' }}</td>
            <td>{{ purchaseRequest.Project }}</td>
            <td>{{ purchaseRequest.Department }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(purchaseRequest.Status)]" :style="{
                display: 'inline-block',
                backgroundColor: purchaseRequest.Status.StatusBgColor,
                borderColor: purchaseRequest.Status.StatusBorderColor,
                fontSize: purchaseRequest.Status.StatusFontSize + 'px',
                color: purchaseRequest.Status.StatusFontColor,
              }">{{ purchaseRequest.Status?.StatusName || "" }}</span>
            </td>
            <td class="text-right">{{ purchaseRequest.Amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Section -->
    <div class="pagination">
      <button @click="goToPage(1)" :disabled="pageNumber === 1">&lt;&lt;</button>
      <button @click="goToPage(pageNumber - 1)" :disabled="pageNumber === 1">&lt;</button>
      <span>{{ pageNumber }} / {{ totalPages }}</span>
      <button @click="goToPage(pageNumber + 1)" :disabled="pageNumber === totalPages">&gt;</button>
      <button @click="goToPage(totalPages)" :disabled="pageNumber === totalPages">&gt;&gt;</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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
  VendorName: string;
  Vendor: Vendor | null;
  Project: string;
  Department: string;
  Status: Status;
  Amount: number;
  ReferenceNo: string;
  PRNoSearchPlaceholder: string;
  Remark: string;
  ItemCode: string;
  ItemName: string;
  selectedItems: boolean;
  TotalAmount: number;
}

interface PaginatedData {
  id: number;
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  RequireDate: string;
  VendorName: string;
  Project: string;
  Department: string;
  Status: string;
  TotalAmount: number;
  DeliveryDate: string;
  selectedItems: boolean;
}
interface StockTaking {
  StockTakingId: number;
  PRNo: string;
  PRDate: string;
  ReferenceNo: string;
  Remark: string;
  Status: Status;
  ItemCode: string;
  ItemName: string;
  Amount: number;
  CreateBy: string;
  CreateDate: string;
  UpdateBy: string | null;
  UpdateDate: string | null;
  VendorId: number;
  VendorName: string;
  Project: string;
  Department: string;
  Search: string;
}
interface CommonResource {
  FromStringResource: string;
  ToStringResource: string;
}


const PRNoSearchPlaceholder = ref('');
const common = ref<CommonResource[]>([]);
const stockTaking = ref<StockTaking[]>([]);
const request = ref<PurchaseRequest[]>([]);
const paginatedData = ref<PaginatedData[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const totalPages = ref(1);
const totalRecords = ref(0);
const pageNumber = ref(1);
const pageSize = ref(10);
const sortBy = ref('PRNo');
const direction = ref('DESC');
const searchString = ref('');
const vendorList = ref<Vendor[]>([]);
const statusList = ref<Status[]>([]);
const permission = ref({
  APPROVE: true,
  MODIFY: true,
  PRINT: true,
  EXPORT: true
});

const showAlertMsg = ref(false);
const PRNO = ref('');
const vendorID = ref<number | null>(null);  
const statusID = ref<number | null>(null);  
const ReferenceNo = ref('');
const remark = ref('');
const itemCode = ref('');
const itemName = ref('');


const fetchPurchaseRequests = async () => {
  try {
    loading.value = true;
    const axiosInstance = await authService.getAuthenticatedAxiosInstance();

    const response = await axiosInstance.get(
      `http://localhost:3692/api/v1/purchaserequest/${pageNumber.value}/${pageSize.value}/${sortBy.value}/${direction.value}/${searchString.value}`
    );

    request.value = response.data.Data; 
    console.log(request.value);
    totalRecords.value = response.data.Pagination.TotalRecords
    totalPages.value = response.data.Pagination.TotalPages
  } catch (err) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  // switch (status) {
  //   case "อนุมัติ":
  //     return "bg-success"; // สีเขียวสำหรับ Approved
  //   case "ร่าง":
  //     return "bg-warning"; // สีเหลืองสำหรับ Draft
  //   case "ปฏิเสธ":
  //     return "bg-danger"; // สีแดงสำหรับ Rejected
  //   default:
  //     return "bg-info"; // สีฟ้าสำหรับสถานะอื่น ๆ
  // }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    pageNumber.value = page;
    fetchPurchaseRequests();
    console.log(page);
  }
};

const NewPR = () => {
  console.log("New Purchase Request");
};

const Approve = () => {
  console.log("Approve action");
};

const GeneratePO = () => {
  console.log("Generate Purchase Order");
};

const PrintList = () => {
  console.log("Print Purchase Request List");
};

const exportToCSV = () => {
  console.log("Export to CSV");
};

const exportToExcel = () => {
  console.log("Export to Excel");
};

const searchList = () => {
  fetchPurchaseRequests();
  console.log("Search details");
};
// watch(searchString, () => {
//   // เรียกค้นหาข้อมูลเมื่อมีการกรอกอย่างน้อย 3 ตัวอักษร หรือเมื่อเคลียร์ข้อมูล
//   if (searchString.value.length >= 1 || searchString.value.length === 0) {
//     fetchPurchaseRequests(); // เรียกค้นหาข้อมูล
//   }
// });
const searchDetails = () => {
  fetchPurchaseRequests();
}
const sortData = (column: string) => {
  if (sortBy.value === column) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    direction.value = 'asc';
  }
  fetchPurchaseRequests();
};

const toggleSelectAll = (event) => {
  const checked = event.target.checked;
  request.value.forEach((request) => {
    request.selectedItems = checked;
  });
};

const hideDivMSG = () => {
  showAlertMsg.value = false;
};

// เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  fetchPurchaseRequests();
});
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container {
  width: 100vw;
  /* ปรับให้เต็มความกว้าง */
  height: 100vh;
  /* ปรับให้เต็มความสูง */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow-y: auto;
  /* เพิ่มการเลื่อนแนวตั้ง */
}

.breadcrumb {
  width: 100%;
  background-color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: gray;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.caption-subject {
  color: rgb(48, 165, 200);
  font-weight: bolder;
  font-size: 1.5em;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.btn {
  padding: 10px 15px;
  border: none;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  border-radius: 5px;
  margin: 0 5px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.alert {
  padding: 15px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin-bottom: 20px;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  color: #333;
}

.table th {
  background-color: #f2f2f2;
  color: rgb(24, 108, 164);
  font-weight: bold;
}

.table tr {
  border-bottom: 1px solid #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #f2f2f2;
  border: none;
  color: black;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
}

.pagination button:hover {
  background-color: #ddd;
}

.pagination button:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.input-group input {
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
}

.input-group-btn {
  margin-left: 5px;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  /* สีข้อความ */
}
</style>
