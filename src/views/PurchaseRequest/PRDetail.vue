<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="purchase-request-detail">
    <div class="card">
      <ActionButtons :actions="actions" createRoute="/PurchaseRequset/Maintain/"
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
          <Remark title="Remark" :remark="request.Notes" />
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

  <!-- <div class="row">
    <div style="clear: both">&nbsp;</div>
    <div class="tabbable-custom" id="tabContent">
      <ul class="nav nav-tabs">
        <li class="active">
          <a href="#comment" id="opencomment" data-toggle="tab">
            <i class="pi pi-comments-o"></i>
            tabComment
          </a>
        </li>
        <li id="liTabfileAttach">
          <a href="#fileAttach" data-toggle="tab">
            <i class="pi pi-paperclip"></i>
            tabAttachment'
          </a>
        </li>
        <li>
          <a href="#activity" data-toggle="tab">
            <i class="pi pi-history"></i>
            tabActivity
          </a>
        </li>
      </ul>
      <div class="tab-content" role="tablist">
        <div role="tabpanel" class="tab-pane active" id="comment">
          <input type="text" style="width: 500px" v-model="tranComment" class="form-control input-inline" />
          <a id="btnAddcomment" class="btn blue btn-outline" @click="addComment">
            <i class="pi pi-comments-o"></i>btnNewCommentResource
          </a>
          <div
            id="ReqComment"
            style="color: red; display: none"
            v-if="showReqComment"
          >
            msgReqComment
          </div>
          <div class="table-scrollable">
            <table class="table table-hover" id="commentPR">
              <thead>
                <tr>
                  <td style="font-weight: bold" class="text-left">comment</td>
                  <td style="font-weight: bold" class="text-left">
                    commentDate
                  </td>
                  <td style="font-weight: bold" class="text-left">commentBy</td>
                  <td class="text-left"></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comment in comments" :key="comment.id">
                  <td>{{ comment.text }}</td>
                  <td>{{ comment.date }}</td>
                  <td>{{ comment.by }}</td>
                  <td>
                    <button @click="deleteComment()">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="fileAttach">
          <div class="form-group">
            <input type="file" @change="uploadChange" class="form-control input-inline" />
            <a id="btnAttach" class="btn blue btn-outline" @click="attachFile">
              <i class="pi pi-paperclip"></i> btnNewAttResource
            </a>
            <span id="lblmessage" style="color: red">uploadMessage</span>
            <input type="hidden" name="uploadfile" v-model="uploadFile" />
            <input type="hidden" name="filename" v-model="uploadFileName" />
          </div>
          <div class="table-scrollable">
            <table class="table table-hover" id="tbAttach">
              <thead>
                <tr>
                  <td style="text-align: center">filesName</td>
                  <td style="text-align: center">attachDate</td>
                  <td style="text-align: center">attachBy</td>
                  <td style="text-align: center">delete</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="file in attachedFiles" :key="file.id">
                  <td>{{ file.name }}</td>
                  <td>{{ file.date }}</td>
                  <td>{{ file.by }}</td>
                  <td>
                    <button @click="deleteAttachment()">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="activity">
          <div class="timeline">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="imgModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"
    v-if="isModalOpen">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <img :src="popupImage" class="img-responsive" id="popupimg" />
        </div>
      </div>
    </div>
  </div> -->
  <!-- END Tabs -->

  <div class="card">
    <Suspense>
      <Tabs v-model:activeIndex="activeIndex" @tab-change="handleTabChange">
        <TabPanel header="Comment" value="1">
          <div class="p-fluid">
            <div class="p-field">
              <InputText v-model="tranComment" placeholder="Enter comment" style="width: 500px" />
              <Button label="New Comment" icon="pi pi-comments" @click="addComment" class="p-button-outlined" />
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

        <TabPanel header="Attachment" value="2">
          <div class="p-fluid">
            <div class="p-field">
              <input type="file" @change="uploadChange" />
              <Button label="Attach" icon="pi pi-paperclip" @click="attachFile" class="p-button-outlined" />
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
    </Suspense>
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
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


interface PurchaseRequestStatus {
  APPROVED: number;
  REJECTED: number;
  SUBMITTED: number;
  CANCELLED: number;
}
interface Commnet {
  id: number;
  text: string;
  date: string;
  by: string;
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
interface AttachedFiles {
  id: number;
  name: string;
  date: string;
  by: string;
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

const handleTabChange = (e: { index: string }) => {
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
const loading = ref(false);
const error = ref<string | null>(null);
const vendorData = ref<Vendorlist>({} as Vendorlist);
const vendorId = ref<number>(0);
const activeIndex = ref('1');

const updateStatus = async (statusId: number) => {
  try {
    loading.value = true;
    await PurchaseRequestService.updateStatus(prNO, statusId);
    await fetchPurchaseRequestDetail();
  } catch (err: any) {
    error.value = `Failed to update status: ${err.message}`;
  } finally {
    loading.value = false;
  }
};
const actions = [
  { label: "Edit", severity: "info", event: "edit-purchase", icon: "pi pi-pencil" },
  { label: "Print", severity: "info", event: "print-purchase" },
  { label: "Approve", severity: "info", event: "approve" },
  { label: "Reject", severity: "danger", event: "reject" },
  { label: "Back", severity: "info", event: "back-to-list" }
];

const columns = [
  // { field: "cog", header: "cog" },
  // { field: "No", header: "No" },
  { field: "ItemCode", header: "Item Code" },
  { field: "ItemName", header: "Item Name" },
  {
    field: "RequiredDate",
    header: "Required Date",
    formatter: (value: Date) => (value ? new Date(value).toLocaleDateString() : "N/A")
  },
  { field: "PONo", header: "PO No" },
  { field: "ReferenceNo", header: "Reference No." },
  { field: "OrderQuantity", header: "Qty" },
  { field: "Unit", header: "UOM" },
  { field: "UnitCost", header: "Unit Cost" },
  { field: "VatCode", header: "VAT" },
  { field: "LineTotal", header: "Total" }
];
const editPR = async () => {

};
const printPR = async () => {

};

const reject = async () => {

};
const approve = async () => {
  try {
    loading.value = true;
    await PurchaseRequestService.approve(`/${prNO}`, prNO);
    await fetchPurchaseRequestDetail();
  } catch (err: any) {
    error.value = `Failed to approve: ${err.message}`;
  } finally {
    loading.value = false;
  }
};
const fetchPurchaseRequestDetail = async () => {
  try {
    loading.value = true;
    // console.log(prNO);
    const response = await PurchaseRequestService.get(prNO);
    // console.log(response.Data, 'response1');

    request.value = response.Data;
    vendorId.value = response.Data.Vendor.VendorId; // บันทึกข้อมูลจาก response

    purchase.value = response.Data.PurchaseRequestItems; // บันท��กข้อมูลจา�� response
    console.log(purchase.value, 'purchase');
    fetchVendorData();

  } catch (err: any) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const fetchVendorData = async () => {
  try {
    console.log(vendorId.value, 'response');
    const response = await vendorService.get(vendorId.value);
    vendorData.value = response.Data;
    console.log(vendorData.value, 'VendorData');
  } catch (err: any) {
    error.value = `Failed to fetch stock taking data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const backToList = async () => {
  router.push(`/{PurchaseRequest/PRList`);
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
  console.log("deleteComment");
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
