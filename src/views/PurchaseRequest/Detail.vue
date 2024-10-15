<template>
  <div v-if="fetchLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="purchase-request-detail">
    <div class="card">
      <ActionButtons :actions="actions" createRoute='/PurchaseRequest/Maintain/'
        createButtonLabel="Create PurchaseRequset" @eidt-pr="editPR" @print-pr="printPR" @approve="approve"
        @reject="reject" @back-to-list="backToList" />

      <DetailHeader title="Purchase Request Detail" :itemNo="request.PurchaseRequestNo" :status="request.Status" />
      <div class="flex flex-col md:flex-row w-full">
        <div class="w-full md:w-1/2">
          <InfoBox title="Vendor Info" :info="{
            'Name': vendorData.VendorName,
            'Address': vendorData.Address1,
            'City': vendorData.City,
            'State': vendorData.State,
            'ZipCode': vendorData.ZipCode,
            'Country': vendorData.Country,
            'TaxId': vendorData.TaxId,
            'BranchCode': vendorData.BranchCode,
          }" />
        </div>

        <div class="w-full md:w-1/2 md:flex md:justify-end">
          <InfoBox title="PurchaseRequest Info" :info="{
            'Issue Date': new Date(request.PurchaseRequestDate).toLocaleDateString(),
            'Require Date': new Date(requiredDate).toLocaleDateString(),
            'Reference No.': request.ReferenceNo,
            'PIC': request.PersonInCharge,
            'Project': request.ProjectName,
            'Department': request.DepaermentName
          }" />
        </div>
      </div>
      <ItemTable :items="purchase" :columns="columns" tableStyle="min-width: 50rem" />

      <div class="flex flex-col md:flex-row w-full">
        <div class="w-full md:w-1/2">
          <Remark title="Remark" :remark="request.Notes"/>
        </div>
        <div class="w-full md:w-1/2 md:flex md:justify-end">
          <InfoBox title="Summary" :info="{
            'Subtotal': request.Subtotal,
            'VAT': request.TaxAmount,
            'Other Charges': request.OtherCharges,
            'Grand Total': request.TotalAmount
          }" />
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <Tabs v-model:activeIndex="activeIndex" @tab-change="handleTabChange">
      <TabList>
        <Tab value="0">
          <i class="pi pi-comments"></i> Comment
        </Tab>
        <Tab value="1">
          <i class="pi pi-paperclip"></i> Attach files
        </Tab>
        <Tab value="2">
          <i class="pi pi-history"></i> Edit History
        </Tab>
      </TabList>
      <TabPanel header="Comment" value="0">
        <div class="p-fluid">
          <div class="p-field flex">
            <InputText v-model="tranComment" placeholder="Enter comment" style="width: 500px" />
            <Button label="Add Comment" icon="pi pi-comments" @click="addComment" class="p-button-outlined" />
          </div>
          <DataTable :value="comments">
            <Column field="text" header="Comment"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="by" header="By"></Column>
            <Column>
              <template #body="slotProps">
                <Button icon="pi pi-trash" @click="deleteComment(slotProps.data)"
                  class="p-button-text p-button-danger" />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>

      <TabPanel header="Attachment" value="1">
        <div class="p-fluid">
          <div class="p-field">
            <FileUpload ref="fileupload" :maxFileSize="1000000" @upload="attachFile" />
            <!-- <Button label="Attach" icon="pi pi-paperclip" @click="attachFile" class="p-button-outlined" /> -->
            <small v-if="uploadMessage" class="p-error">{{ uploadMessage }}</small>
          </div>
          <DataTable :value="attachedFiles">
            <Column field="name" header="File Name"></Column>
            <Column field="date" header="Date"></Column>
            <Column field="by" header="By"></Column>
            <Column>
              <template #body="slotProps">
                <Button icon="pi pi-trash" @click="deleteAttachment(slotProps.data)"
                  class="p-button-text p-button-danger" />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </Tabs>
  </div>

</template>

<script setup lang="ts">
import ActionButtons from '@/components/ActionButtons.vue';
import DetailHeader from '@/components/DetailHeader.vue';
import InfoBox from '@/components/InfoBox.vue';
import ItemTable from '@/components/ItemTable.vue';
import Remark from '@/components/Remark.vue';
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import PurchaseRequestService from "@/Service/purchaseRequestService";
import vendorService from '@/Service/vendorService';
import Tabs from 'primevue/tabs';
import TabPanel from 'primevue/tabpanel';
import { Subscription } from 'rxjs'; // นำเข้า RxJS Subscription
import toast from 'primevue/toast';

let subscription: Subscription; 
interface PurchaseRequestStatus {
  APPROVED: number;
  REJECTED: number;
  SUBMITTED: number;
  CANCELLED: number;
}

interface PurchaseRequest {
  PurchaseRequestNo: string;
  PurchaseRequestDate: string;
  DeliveryDate: string;
  ReferenceNo: string;
  RequireDate: Date;
  PIC: string;
  Project: string;
  Department: string;
  Status: Status;
  IssueDate: string;
  PersonInCharge: string;
  ProjectName: '';
  DepaermentName: '';
  Notes: string;
  Vendor: Vendor;
  Subtotal: number;
  TaxAmount: number;
  OtherCharges: number;
  TotalAmount: number;
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

interface PurchaseRequestItems {
  id: number;
  ItemCode: string;
  ItemName: string;
  RequiredDate: Date;
  PurchaseOrderNo: string;
  ReferenceNo: string;
  Unit: string;
  UnitCost: number;
  VatCode: string;
  LineTotal: number;
  Image: any;
  OrderQty: number;
}
interface Vendor {
  VendorId: number;
  VendorCode: string;
  VendorName: string;
  Address: string;
}
interface Vendorlist {
  Address1: string;
  City: string;
  State: string;
  ZipCode: number;
  Country: string;
  TaxId: number;
  BranchCode: string;
  VendorName: string;
}
interface Comment {
  text: string;
  date: string;
  by: string;
}

interface AttachedFile {
  name: string;
  date: string;
  by: string;
}

const activeIndex = ref(0);

const handleTabChange = (e: { index: number }) => {
  activeIndex.value = e.index;
};

const requiredDate = computed(() => {
  if (purchase.value && purchase.value.length > 0) {
    return purchase.value[0].RequiredDate;
  }
  return 'N/A';
});
const purchase = ref();
const router = useRouter();
const request = ref<PurchaseRequest>({} as PurchaseRequest);

const purchaseRequestStatusEnum = ref<PurchaseRequestStatus>({
  APPROVED: 200,
  REJECTED: 1400,
  SUBMITTED: 120,
  CANCELLED: 1000,
});
const route = useRoute();
// const prNo = String(route.params.no);
const prNO = String(route.params.no);
const permission = ref({
  APPROVE: true,
  EXPORT: true,
  MODIFY: true,
  PRINT: true,
});

const uploadMessage = ref<string>('');
const uploadFile = ref<File | null>(null);
const uploadFileName = ref<string>('');
const tranComment = ref<string>('');
const comments = ref<Comment[]>([]);;
const attachedFiles = ref<AttachedFile[]>([]);
const fetchLoading = ref(true);
const error = ref<string | null>(null);
const vendorData = ref<Vendorlist>({} as Vendorlist);
const vendorId = ref<number>(0);

// const updateStatus = async (statusId: number) => {
//   try {
//     fetchLoading.value = true;
//     await PurchaseRequestService.updateStatus(prNO, statusId);
//     await fetchPurchaseRequestDetail();
//   } catch (err: any) {
//     error.value = `Failed to update status: ${err.message}`;
//   } finally {
//     fetchLoading.value = false;
//   }
// };
const actions = [
  { label: "Edit", severity: "info", event: "edit-purchase" },
  { label: "Print", severity: "info", event: "print-purchase" },
  { label: "Approve", severity: "info", event: "approve" },
  { label: "Reject", severity: "danger", event: "reject" },
  { label: "Back", severity: "info", event: "back-to-list" }
];

const columns = [
  { field: "LineNumber", header: "No" },
  { field: "ItemCode", header: "Item Code" },
  { field: "ItemName", header: "Item Name" },
  { field: "RequiredDate", header: "Required Date", },
  { field: "PONo", header: "PO No" },
  { field: "ReferenceNo", header: "Reference No." },
  { field: "OrderQuantity", header: "Qty" },
  { field: "Unit", header: "UOM" },
  { field: "UnitCost", header: "Unit Cost" },
  { field: "VatCode", header: "VAT" },
  { field: "LineTotal", header: "Total" }
];
const editPR = async () => {
  router.push(`'/PurchaseRequest/PRMaintain/'${prNO}`);
};
const printPR = async () => {

};

const reject = async () => {

};
const approve = async () => {
  // try {
  //   fetchLoading.value = true;
  //   await PurchaseRequestService.approve(`/${prNO}`, prNO);
  //   await fetchPurchaseRequestDetail();
  // } catch (err: any) {
  //   error.value = `Failed to approve: ${err.message}`;
  // } finally {
  //   fetchLoading.value = false;
  // }
};
const fetchPurchaseRequestDetail = () => {
  fetchLoading.value = true;

  subscription = PurchaseRequestService.get(prNO).subscribe({
    next: (response) => {
      if (response.IsSuccess) {
        request.value = response.Data;
        vendorId.value = response.Data.Vendor.VendorId; // บันทึกข้อมูลจาก response
        purchase.value = response.Data.PurchaseRequestItems; // บันทึกข้อมูลจาก response
        console.log(purchase.value, 'purchase');

        fetchVendorData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล vendor

      } else {
        toast.add({
          severity: 'error',
          summary: response.StatusCode.toString(),
          detail: response.Error?.Message,
          life: 2000
        });
      }
    },
    error: (error) => {
      toast.add({
        severity: 'error',
        summary: 'Error fetching purchase requests',
        detail: error.message,
        life: 2000
      });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
};

const fetchVendorData = async () => {
  try {
    console.log(vendorId.value, 'response');
    const response = await vendorService.get(vendorId.value);
    vendorData.value = response.Data;
    console.log(vendorData.value, 'VendorData');
  } catch (err: any) {
    error.value = `Failed to fetch vendor data: ${err.message}`;
  } finally {
    fetchLoading.value = false;
  }
};

const backToList = async () => {
  router.push(`/PurchaseRequest/List`);
}
const deleteComment = (comment: Comment) => {
  const index = comments.value.indexOf(comment);
  if (index > -1) {
    comments.value.splice(index, 1);
  }
};

const addComment = () => {
  if (tranComment.value) {
    comments.value.push({
      text: tranComment.value,
      date: new Date().toLocaleString(),
      by: 'Current User'
    });
    tranComment.value = '';
  }
};
const showReqComment = () => {
  console.log("deleteComment");
};
const deleteAttachment = (file: AttachedFile) => {
  const index = attachedFiles.value.indexOf(file);
  if (index > -1) {
    attachedFiles.value.splice(index, 1);
  }
};
const uploadChange = () => {
  console.log("");
};
const attachFile = () => {
  if (uploadFile.value) {
    attachedFiles.value.push({
      name: uploadFileName.value,
      date: new Date().toLocaleString(),
      by: 'Current User'
    });
    uploadFile.value = null;
    uploadFileName.value = '';
    uploadMessage.value = 'File uploaded successfully';
  } else {
    uploadMessage.value = 'Please select a file';
  }
};
const openPopUpImg = () => {
  console.log("deleteComment");
};

onMounted(() => {
  fetchPurchaseRequestDetail();
});

</script>

<style scoped>
.modal-content {
  position: relative;
  background-color: #fff;
  border: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: 0;
}

table th,
td {
  white-space: nowrap !important;
}
</style>
