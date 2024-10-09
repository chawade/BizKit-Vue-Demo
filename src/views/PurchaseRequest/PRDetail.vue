<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else class="purchase-request-detail">
    <div class="card">
      <ActionButtons :actions="actions" createRoute="/PurchaseRequset/Maintain/" createButtonLabel="Create PurchaseRequset"
        @eidt-pr="editPR" @print-pr="printPR" @approve="approve" @reject="reject" @back-to-list="backToList" />

      <DetailHeader title="Purchase Request Detail" :itemNo="request.PurchaseRequestNo" :status="request.Status" />
      <div class="flex justify-between gap-4">
        <!-- Vendor Info อยู่ทางซ้าย -->
        <div class="w-1/2">
          <InfoBox title="Vendor Info" :info="{
            'Issue Date': request.IssueDate,
            'Reqeust Date': request.PurchaseRequestDate,
            'Reference No.': request.ReferenceNo,
            'PIC': request.PersonInCharge,
            'Project': request.ProjectName,
            'Depaerment': request.DepaermentName,
          }" />
        </div>

        <!-- PurchaseRequest Info อยู่ทางขวา -->
        <div class="w-1/2">
          <InfoBox title="PurchaseRequest Info" :info="{
            'Issue Date': request.IssueDate,
            'Reqeust Date': request.PurchaseRequestDate,
            'Reference No.': request.ReferenceNo,
            'PIC': request.PersonInCharge,
            'Project': request.ProjectName,
            'Depaerment': request.DepaermentName,
          }" />
        </div>
      </div>
      <ItemTable :items="purchase" :columns="columns" tableStyle="min-width: 50rem" />

      <Remark title="Remark" :remark="request.Remark" />
      <!-- <div class="row">
      <div class="col-sm-8">
        <div v-if="enableWorkFlow && purchaseRequestStatusEnum.APPROVED">
          <template v-if="!permission.APPROVE">
            <button v-if="permission.PRINT" class="btn btn-outline-primary" id="btnshowreport">
              <i class="pi pi-print"></i>btnPrint
            </button>
            <button v-if="purchaseRequestStatusEnum.SUBMITTED" class="btn btn-outline-primary" id="btnSubmit">
              <i class="pi pi-send"></i> btnSubmit
            </button>
            <button v-if="
              permission.MODIFY &&
              purchaseRequestStatusEnum.CANCELLED &&
              purchaseRequestStatusEnum.SUBMITTED
            " class="btn btn-outline-primary" id="btnPrEdit">
              <i class="pi pi-pencil"></i>btnEdit
            </button>
            <button v-if="permission.MODIFY && purchaseRequestStatusEnum.CANCELLED" class="btn btn-outline-primary"
              id="btnCancel">
              <i class="pi pi-trash"></i>btnCancel
            </button>
          </template>
<template v-else>
            <button v-if="permission.MODIFY && purchaseRequestStatusEnum.CANCELLED" class="btn btn-outline-primary"
              id="btnPrEdit">
              <i class="pi pi-pencil"></i>btnEdit
            </button>
            <button v-if="permission.PRINT" class="btn btn-outline-primary">
              <i class="pi pi-print"></i>print'
            </button>
            <button class="btn btn-success" type="button" id="btnApprove">
              <i class="pi pi-check-circle"></i>btnApprove
            </button>
            <div class="btn-group">
              <button class="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                <i class="pi pi-times"></i>btnReject
                <i class="pi pi-angle-down"></i>
              </button>
              <div class="dropdown-menu dropdown-content input-large hold-on-click" role="menu">
                <div class="input-group">
                  <label>ReasonsForRejection</label>
                  <textarea id="ReasonsForRejection" class="form-control" v-model="rejectReason"
                    placeholder="enterReason"></textarea>
                  <button class="btn btn-danger">btnReject</button>
                </div>
              </div>
            </div>
          </template>
</div>
</div>
<div class="col-xs-4 text-right">
  <i class="pi pi-arrow-left"></i>back

  <template v-if="permission.MODIFY">
          <button class="btn btn-outline-primary">
            <i class="pi pi-plus-circle"></i>newPR
          </button>
        </template>
</div>
</div> -->
    </div>
  </div>

  <!-- Invoice Head -->
  <div class="row invoice-head">
    <div class="col-md-7 col-xs-6">
      <div class="invoice-logo">
        <h1 class="uppercase text-left">
          <span>PRDetailHeader</span>
        </h1>
      </div>
    </div>
    <!-- <div class="col-md-5 col-xs-6 text-right">
      <div class="invoice-no">
        <h4>{{ prNo }}</h4>
        <p v-if="purchaseRequestStatusEnum.REJECTED">
          <span class="text-muted">{{ rejectReason }}: </span>
          <span class="text-danger">{{ rejectReason }}</span>
        </p>
      </div>
    </div> -->
  </div>

  <!-- Vendor and Purchase Request Info -->
  <div class="row invoice-cust-add">
    <div class="col-xs-5">
      <div class="portlet bz-default box">
        <div class="portlet-title">
          <div class="caption">
            <span class="control-label invoice-title uppercase">vendorInfo</span>
          </div>
        </div>
        <div class="portlet-body">
          <div class="row static-info">
            <!-- <div class="col-sm-12" v-html="vendorAddressHtml"></div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-5 col-md-offset-2">
      <div class="portlet bz-default box">
        <div class="portlet-title">
          <div class="caption">
            <span class="invoice-title uppercase">PurchaseRequestInfo</span>
          </div>
        </div>
        <!-- <tr v-for=" in request" :key="prNo"> -->
        <!-- <div class="portlet-body">
          <div class="row static-info">
            <span class="invoice-desc col-sm-4">Issue Date</span>
            <span class="col-sm-6 font-normal">{{ request.PurchaseRequestDate ?? '' }}</span>
          </div>
          <div class="row static-info">
            <span class="invoice-desc col-sm-4">Require Date</span>
            <span class="col-sm-6 font-normal">{{
              request.DeliveryDate ?? ''
            }}</span>
          </div>
          <div class="row static-info">
            <span class="invoice-desc col-sm-4">Reference No.</span>
            <span class="col-sm-6 font-normal">{{
              request.ReferenceNo ?? ''
            }}</span>
          </div>
          <div class="row static-info">
            <span class="invoice-desc col-sm-4">PIC</span>
            <span class="col-sm-6 font-normal">{{
              request.PIC ?? ''
            }}</span>
          </div>
          <div class="row static-info">
            <span class="invoice-desc col-sm-4">Project</span>
            <span class="col-sm-6 font-normal">{{
              request.Project ?? ''
            }}</span>
          </div>
          <div class="row static-info">
            <span class="invoice-desc   col-sm-4">Department</span>
            <span class="col-sm-6 font-normal">{{
              request.Department ?? ''
            }}</span>
          </div>
        </div> -->
        <!-- </tr> -->
      </div>
    </div>
  </div>

  <div class="row">
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
          <!-- <div
            id="ReqComment"
            style="color: red; display: none"
            v-if="showReqComment"
          >
            msgReqComment
          </div> -->
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
            <!-- Activity content goes here -->
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
          <!-- <img :src="popupImage" class="img-responsive" id="popupimg" /> -->
        </div>
      </div>
    </div>
  </div>
  <!-- END Tabs -->
</template>

<script setup lang="ts">
import ActionButtons from '@/components/ActionButtons.vue';
import DetailHeader from '@/components/DetailHeader.vue';
import InfoBox from '@/components/InfoBox.vue';
import ItemTable from '@/components/ItemTable.vue';
import Remark from '@/components/Remark.vue';
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import authService from '@/Service/AuthService';
import PurchaseRequestService from "@/Service/purchaseRequestService";

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
  PIC: string;
  Project: string;
  Department: string;
  Status: Status;
  IssueDate: string;
  PersonInCharge: string;
  ProjectName: '';
  DepaermentName: '';
  Remark: string;
  Vendor: Vendor;
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
  RequiredDate: string;
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
const purchase = ref([]);
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
const comments = ref<Commnet[]>([]);
const isModalOpen = ref("");
const uploadFile = ref("");
const uploadFileName = ref("");
const attachedFiles = ref<AttachedFiles[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

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
  { label: "Edit Purchase", severity: "info", event: "edit-purchase" },
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
  { field: "RequiredDate", header: "Required Date" },
  { field: "PONo", header: "PO No" },
  { field: "ReferenceNo", header: "Reference No." },
  { field: "OrderQuantity", header: "Qty" },
  { field: "Unit", header: "UOM" },
  { field: "UnitCost", header: "Unit Cost" },
  { field: "VatCode", header: "Vat" },
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
  debugger;
  try {
    loading.value = true;
    // console.log(prNO);
    const response = await PurchaseRequestService.get(prNO);
    console.log(response.Data, 'response1');

    request.value = response.Data; // บันทึกข้อมูลจาก response
    purchase.value = response.Data.PurchaseRequestItems; // บันท��กข้อมูลจา�� response
    console.log(request.value, 'response');
  } catch (err: any) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const backToList = async () => {
  router.push(`/{PurchaseRequest/PRList`);
}
const deleteComment = () => {
  console.log("deleteComment");
};

const tranComment = () => {
  console.log("deleteComment");
};
const addComment = () => {
  console.log("deleteComment");
};
const showReqComment = () => {
  console.log("deleteComment");
};
const deleteAttachment = () => {
  console.log("deleteComment");
};
const uploadChange = () => {
  console.log("deleteComment");
};
const attachFile = () => {
  console.log("deleteComment");
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
