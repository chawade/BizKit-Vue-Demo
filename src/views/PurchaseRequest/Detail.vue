<template>
  <div v-if="fetchLoading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="purchase-request-detail">
    <div class="card">
      <ActionButtons :actions="actions" createRoute='/PurchaseRequest/Maintain/'
        createButtonLabel="Create PurchaseRequset" @eidt-pr="editPR" @print-pr="printPR" @approve="approve"
        @reject="reject" @back-to-list="backToList" />

      <DetailHeader title="Purchase Request Detail" :itemNo="request.purchaseRequestNo" :status="request.status" />
      <div class="flex flex-col md:flex-row w-full">
        <div class="w-full md:w-1/2">
          <InfoBox title="Vendor Info" :info="{
            'Name': vendorData.vendorName,
            'Address': vendorData.address1,
            'City': vendorData.city,
            'State': vendorData.state,
            'ZipCode': vendorData.zipCode,
            'Country': vendorData.country,
            'TaxId': vendorData.taxId || '',
            'BranchCode': vendorData.branchCode,
          }" />
        </div>

        <div class="w-full md:w-1/2 md:flex md:justify-end">
          <InfoBox title="PurchaseRequest Info" :info="{
            'Issue Date': new Date(request.purchaseRequestDate).toLocaleDateString(),
            'Require Date': new Date(request.deliveryDate).toLocaleDateString(),
            'Reference No.': request.referenceNo,
            'PIC': request.personInCharge,
            'Project': request.projectName,
            'Department': request.departmentName
          }" />
        </div>
      </div>
      <div class="datatable-container mb-6">
      <DataTable :value="purchase" tableStyle="min-width: 50rem">
        <Column field="lineNumber" header="No."></Column>
        <Column field="itemCode" header="Item Code"></Column>
        <Column field="itemName" header="Item Name"></Column>
        <Column field="requiredDate" header="Required Date"></Column>
        <Column field="poNo" header="PO No"></Column>
        <Column field="referenceNo" header="Reference No."></Column>
        <Column field="orderQuantity" header="Order Qty"></Column>
        <Column field="unit" header="UOM"></Column>
        <Column field="unitCost" header="Unit Cost"></Column>
        <Column field="vatAmount" header="VAT"></Column>
        <Column field="lineTotal" header="Total"></Column>
      </DataTable>
      </div>
      <!-- <ItemTable :items="purchase" :columns="columns" :dataKey="'id'" :loading="fetchLoading" :lazy="false"
        :totalRecords="purchase.length" :menu="menuaa" tableStyle="min-width: 50rem" :pageIdentifier="'PR-Detail'"/> -->

      <div class="flex flex-col md:flex-row w-full">
        <div class="w-full md:w-1/2">
          <Remark title="Remark" :remark="request.notes" />
        </div>
        <div class="w-full md:w-1/2 md:flex md:justify-end">
          <InfoBox title="Summary" :info="{
            'Subtotal': request.subtotal,
            'VAT': request.taxAmount,
            'Other Charges': request.otherCharges,
            'Grand Total': request.totalAmount
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
import type { PurchaseRequest, PurchaseRequestResource } from '@/Model/purchaseRequest';
import type { VendorResource } from '@/Model/vendor';

let subscription: Subscription;
let vendorSubscription: Subscription;
interface PurchaseRequestStatus {
  APPROVED: number;
  REJECTED: number;
  SUBMITTED: number;
  CANCELLED: number;
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
const request = ref<PurchaseRequestResource>({} as PurchaseRequestResource);

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
const vendorData = ref<VendorResource>({} as VendorResource);
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
  { label: "Approve", severity: "succes", event: "approve" },
  { label: "Reject", severity: "danger", event: "reject" },
  { label: "Back", severity: "info", event: "back-to-list" }
];

// const columns = [
//   { field: "lineNumber", header: "No" },
//   { field: "itemCode", header: "Item Code" },
//   { field: "itemName", header: "Item Name" },
//   { field: "requiredDate", header: "Required Date", },
//   { field: "poNo", header: "PO No" },
//   { field: "referenceNo", header: "Reference No." },
//   { field: "orderQuantity", header: "Qty" },
//   { field: "unit", header: "UOM" },
//   { field: "unitCost", header: "Unit Cost" },
//   { field: "vatAmount", header: "VAT" },
//   { field: "lineTotal", header: "Total" }
// ];

// const menuaa = ref([
//   {
//     label: 'Options',
//     items: [
//       {
//         label: 'Detail',
//         icon: 'pi pi-refresh'
//       },
//       {
//         label: 'Export',
//         icon: 'pi pi-upload'
//       },
//       {
//         label: 'Cancel',
//         icon: 'pi pi-trash'
//       }
//     ]
//   }
// ]);
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
      if (response.isSuccess) {
        request.value = response.data;
        vendorId.value = response.data.vendor.vendorId; 
        purchase.value = response.data.purchaseRequestItems; 
        console.log(purchase.value, 'purchase');

        fetchVendorData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล vendor

      } else {
        toast.add({
          severity: 'error',
          summary: response.statusCode.toString(),
          detail: response.error?.message,
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

const fetchVendorData = () => {
  console.log(vendorId.value, 'response');

  vendorSubscription = vendorService.get(vendorId.value).subscribe({
    next: (response) => {
      if (response.isSuccess) {
        vendorData.value = response.data;
        console.log(vendorData.value, 'VendorData');
      } else {
        toast.add({
          severity: 'error',
          summary: response.statusCode.toString(),
          detail: response.error?.message,
          life: 2000
        });
      }
    },
    error: (error) => {
      toast.add({
        severity: 'error',
        summary: 'Failed to fetch vendor data',
        detail: error.message,
        life: 2000
      });
    },
    complete: () => {
      fetchLoading.value = false;
    }
  });
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
