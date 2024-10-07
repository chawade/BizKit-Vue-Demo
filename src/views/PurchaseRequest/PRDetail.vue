<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div>
    <span>PRDetailHeader</span>
    <!-- Breadcrumb -->
    <ul class="page-breadcrumb">
      <li>
        <i class="pi pi-home"></i>
        <router-link to="/dashboard">menuHomeTitle</router-link>
        <i class="pi pi-angle-right"></i>
      </li>
      <li>
        <router-link to="/PurchaseRequest/List">menuSubPRListTitle</router-link>
        <i class="pi pi-angle-right"></i>
      </li>
      <li>
        <span>prDetailHeader'</span>
      </li>
    </ul>

    <input type="hidden" v-model="hiddenPRNo" id="hdnPRNo" />

    <!-- UpdateStatus Form -->
    <!-- <form @submit.prevent="updateStatus"> -->
    <input type="hidden" v-model="status" />
    <input type="hidden" v-model="statusBFU" />
    <input type="hidden" v-model="prNo" />
    <input type="hidden" v-model="rejectReason" />
    <!-- </form> -->

    <!-- ShowReport Form -->
    <!-- <form @submit.prevent="showReport" target="_blank"> -->
    <input type="hidden" v-model="prNo" />
    <input type="hidden" id="Original" />
    <input type="hidden" id="Copy" />
    <!-- </form> -->

    <!-- GeneratePO Form -->
    <!-- <form @submit.prevent="generatePO"> -->
    <input type="hidden" v-model="status" />
    <input type="hidden" v-model="statusBFU" />
    <input type="hidden" v-model="prNo" />
    <!-- </form> -->

    <div class="row">
      <div class="col-sm-8">
        <div v-if="enableWorkFlow && purchaseRequestStatusEnum.APPROVED">
          <template v-if="!permission.APPROVE">
            <button
              v-if="permission.PRINT"
              class="btn btn-outline-primary"
              id="btnshowreport"
            >
              <i class="pi pi-print"></i>btnPrint
            </button>
            <button
              v-if="purchaseRequestStatusEnum.SUBMITTED"
              class="btn btn-outline-primary"
              id="btnSubmit"
            >
              <i class="pi pi-send"></i> btnSubmit
            </button>
            <button
              v-if="
                permission.MODIFY &&
                purchaseRequestStatusEnum.CANCELLED &&
                purchaseRequestStatusEnum.SUBMITTED
              "
              class="btn btn-outline-primary"
              id="btnPrEdit"
            >
              <i class="pi pi-pencil"></i>btnEdit
            </button>
            <button
              v-if="permission.MODIFY && purchaseRequestStatusEnum.CANCELLED"
              class="btn btn-outline-primary"
              id="btnCancel"
            >
              <i class="pi pi-trash"></i>btnCancel
            </button>
          </template>
          <template v-else>
            <!-- Additional Buttons when APPROVE permission is present -->
            <button
              v-if="permission.MODIFY && purchaseRequestStatusEnum.CANCELLED"
              class="btn btn-outline-primary"
              id="btnPrEdit"
            >
              <i class="pi pi-pencil"></i>btnEdit
            </button>
            <button v-if="permission.PRINT" class="btn btn-outline-primary">
              <i class="pi pi-print"></i>print'
            </button>
            <button class="btn btn-success" type="button" id="btnApprove">
              <i class="pi pi-check-circle"></i>btnApprove
            </button>
            <div class="btn-group">
              <button
                class="btn btn-danger dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="pi pi-times"></i>btnReject
                <i class="pi pi-angle-down"></i>
              </button>
              <div
                class="dropdown-menu dropdown-content input-large hold-on-click"
                role="menu"
              >
                <div class="input-group">
                  <label>ReasonsForRejection</label>
                  <textarea
                    id="ReasonsForRejection"
                    class="form-control"
                    v-model="rejectReason"
                    placeholder="enterReason"
                  ></textarea>
                  <button class="btn btn-danger">btnReject</button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="col-xs-4 text-right">
        <!-- <button class="btn btn-outline-primary" @click="$router.push('/PurchaseRequest/List')"> -->
        <i class="pi pi-arrow-left"></i>back
        <!-- </button> -->
        <template v-if="permission.MODIFY">
          <button class="btn btn-outline-primary">
            <i class="pi pi-plus-circle"></i>newPR
          </button>
        </template>
      </div>
    </div>
  </div>
  <!-- Message Section -->
  <div class="row">
    <div id="divMsgMessage">
      <!-- <div id="alertmsg" class="alert alert-danger" v-if="showAlertMessage"> -->
      <!-- <button type="button" @click="hideDivMSG" class="close" aria-label="Close"> -->
      <span aria-hidden="true">&times;</span>
      <!-- </button> -->
      <span>alertMessage</span>
    </div>
  </div>
  <!-- </div> -->

  <!-- Invoice Head -->
  <div class="row invoice-head">
    <div class="col-md-7 col-xs-6">
      <div class="invoice-logo">
        <h1 class="uppercase text-left">
          <span>PRDetailHeader</span>
        </h1>
      </div>
    </div>
    <div class="col-md-5 col-xs-6 text-right">
      <div class="invoice-no">
        <h4>{{ prNo }}</h4>
        <!-- <span class="label label-sm status" :style="statusStyle">statusName</span> -->
        <p v-if="purchaseRequestStatusEnum.REJECTED">
          <span class="text-muted">{{ rejectReason }}: </span>
          <span class="text-danger">{{ rejectReason }}</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Vendor and Purchase Request Info -->
  <div class="row invoice-cust-add">
    <div class="col-xs-5">
      <div class="portlet bz-default box">
        <div class="portlet-title">
          <div class="caption">
            <span class="control-label invoice-title uppercase"
              >vendorInfo</span
            >
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
          <div class="portlet-body">
            <div class="row static-info">
              <span class="invoice-desc col-sm-4">Issue Date</span>
              <span class="col-sm-6 font-normal">{{  request.PurchaseRequestDate ?? '' }}</span>
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
          </div>
        <!-- </tr> -->
      </div>
    </div>
  </div>

  <!-- Purchase Request Line Items Table -->
  <div class="row invoice-body">
    <div class="row">
      <div class="col-sm-12">
        <div class="table-responsive">
          <table class="table table-hover table-striped" id="prList">
            <thead>
              <tr>
                <th style="text-align: center"></th>
                <th style="text-align: center; width: 5%">No</th>
                <th style="text-align: center; width: 7%">Image</th>
                <th style="text-align: left; min-width: 150px">ItemCode</th>
                <th style="text-align: left; width: 180px">ItemName</th>
                <th style="text-align: center; width: 110px">RequiredDate</th>
                <th style="text-align: center; width: 120px">PO No</th>
                <th style="text-align: center; width: 120px">Reference No.</th>
                <th style="text-align: right; width: 120px">Qty</th>
                <th style="text-align: center; width: 50px">UOM</th>
                <th style="text-align: right; width: 120px">Unit Cost</th>
                <th style="text-align: right; width: 120px">Vat</th>
                <th style="text-align: right; width: 130px">Total</th>
              </tr>
            </thead>
            <tbody>
        <tr v-for="(item, index) in purchase" :key="prNo">
          <td>
            <div class="d-flex bz-expandable-wrapper"></div>
          </td>
          <td>{{ index + 1 }}</td>
          <td>
            <a v-if="item.Image" title="Click to show image." @click="openPopUpImg(item.Image)">
              <img class="bz-icon imgitem" :src="item.Image" />
            </a>
            <i v-else class="pi pi-picture-o fa-2x"></i>
          </td>
          <td>{{ item.ItemCode }}</td>
          <td>{{ item.ItemName }}</td>
          <td>{{ item.RequiredDate }}</td>
          <td>{{ item.PurchaseOrderNo || '' }}</td>
          <td>{{ item.ReferenceNo || '' }}</td>
          <td>{{ item.OrderQty}}</td>
          <td>{{ item.Unit || '' }}</td>
          <td>{{ item.UnitCost }}</td>
          <td>{{ item.VatCode }}</td>
          <td>{{ item.LineTotal }}</td>
        </tr>
      </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-xs-5">
      <div class="portlet bz-default box">
        <div class="portlet-title">
          <div class="caption">
            <span class="invoice-title uppercase">Remark</span>
          </div>
        </div>
        <div class="portlet-body">
          <span>notes</span>
        </div>
      </div>
    </div>
    <!-- <div class="col-xs-5 col-md-offset-2 text-right doc-footer">
          <div class="row">
            <span class="col-md-6 control-label">subtotal</span>
            <span id="Subtotal" class="col-md-6 text-right">{{ subtotalForDisplay }}</span>
          </div>
          <div class="row">
            <span class="col-md-6 control-label">tax</span>
            <span id="TaxAmount" class="col-md-6 text-right">{{ taxAmountForDisplay }}</span>
          </div>
          <div class="row">
            <span class="col-md-6 control-label">{{ $t('purchaseRequest.otherCharges') }}</span>
            <span id="OtherCharges" class="col-md-6 text-right">{{ otherChargesForDisplay }}</span>
          </div>
          <div class="row bz-subtotal" style="margin-top:5px">
            <div class="col-md-6">{{ adjustmentLabel }}</div>
            <div class="col-md-6">{{ adjustment }}</div>
          </div>
          <div class="row bz-bg-default bz-total bold">
            <span class="col-md-6 control-label bold">{{ $t('purchaseRequest.grandTotal') }}</span>
            <div class="col-md-6">
              <span id="lblVendorCurrencyCode" class="water">
                <span id="TotalAmount">{{ totalAmountForDisplay }}</span>
                vendorCurrencyCode
              </span>
              <input type="hidden" v-model="vendorCurrencyCode" />
            </div>
          </div>
        </div> -->
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
          <input
            type="text"
            style="width: 500px"
            v-model="tranComment"
            class="form-control input-inline"
          />
          <a
            id="btnAddcomment"
            class="btn blue btn-outline"
            @click="addComment"
          >
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
                    <button @click="deleteComment(comment.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="fileAttach">
          <div class="form-group">
            <input
              type="file"
              @change="uploadChange"
              class="form-control input-inline"
            />
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
                    <button @click="deleteAttachment(file.id)">Delete</button>
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
  <div
    id="imgModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myModalLabel"
    aria-hidden="true"
    v-if="isModalOpen"
  >
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
import { ref, onMounted } from "vue";
import authService from "@/service/authService";

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
const request = ref<PurchaseRequest>({} as PurchaseRequest);
const purchase = ref<PurchaseRequestItems[]>([]);
const $router = "";
const updateStatus = ref("");
const purchaseRequestStatusEnum = ref<PurchaseRequestStatus>({
  APPROVED: 200,
  REJECTED: 1400,
  SUBMITTED: 120,
  CANCELLED: 1000,
});
const hiddenPRNo = ref("");
const status = ref<PurchaseRequestStatus[]>([]);
const statusBFU = ref("");
const rejectReason = ref("");
const prNo = ref("PR2409046");
const permission = ref({
  APPROVE: true,
  EXPORT: true,
  MODIFY: true,
  PRINT: true,
});
const comments = ref<Commnet[]>([]);
const enableWorkFlow = ref("");
const isModalOpen = ref("");
const uploadFile = ref("");
const uploadFileName = ref("");
const attachedFiles = ref<AttachedFiles[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);


const fetchPurchaseRequestDetail = async () => {
  debugger;
  try {
    loading.value = true;
    const axiosInstance = await authService.getAuthenticatedAxiosInstance();
    
    const response = await axiosInstance.get(
      `http://localhost:3692/api/v1/purchaserequest/${prNo.value}`
    );
    // console.log(response.data.Data,'response1');
    
    request.value = response.data.Data; // บันทึกข้อมูลจาก response
    purchase.value = response.data.Data.PurchaseRequestItems; // บันท��กข้อมูลจา�� response
    console.log(request.value,'response');
  } catch (err) {
    error.value = `Failed to fetch purchase requests: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const deleteComment = (id) => {
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
const deleteAttachment = (id) => {
  console.log("deleteComment");
};
const uploadChange = () => {
  console.log("deleteComment");
};
const attachFile = () => {
  console.log("deleteComment");
};
const openPopUpImg = (image) => {
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
