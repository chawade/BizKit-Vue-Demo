<template>
  <h1 class="page-title">
    PRMaintainHeader

    <input type="hidden" v-model="companyCurrencyCode" />
    <input type="hidden" v-model="vendorCurrencyCode" />
    <input type="hidden" v-model="vendorName" />
    <input type="hidden" v-model="vendorCode" />
    <input type="hidden" v-model="vendorTaxID" />
    <input type="hidden" v-model="vendorBranchCode" />
    <input type="hidden" v-model="vendorAddress1" />
    <input type="hidden" v-model="vendorAddress2" />
    <input type="hidden" v-model="vendorCity" />
    <input type="hidden" v-model="vendorState" />
    <input type="hidden" v-model="vendorCountry" />
    <input type="hidden" v-model="vendorZipCode" />
    <input type="hidden" v-model="deliveryAddress1" />
    <input type="hidden" v-model="deliveryAddress2" />
    <input type="hidden" v-model="deliveryCity" />
    <input type="hidden" v-model="deliveryState" />
    <input type="hidden" v-model="deliveryZipCode" />
    <input type="hidden" v-model="deliveryCountry" />
    <input type="hidden" v-model="statusBFU" />
    <input type="hidden" v-model="status" />
    <input type="hidden" v-model="dateLockPeriod" />
    <input type="hidden" v-model="lockStatus" />
    <input type="hidden" v-model="hiddenPRNo" id="hdnPRNo" />
    <input type="hidden" v-model="autoGenerateNumber" />
    <input type="hidden" v-model="editMode" />
    <input type="hidden" v-model="stringPRDateEn" />
    <input type="hidden" v-model="mode" />
    <input type="hidden" v-model="hdnRevisionNo" />
    <input type="hidden" v-model="hdnOrgPRNo" />
  </h1>

  <div class="page-bar">
    <ul class="page-breadcrumb">
      <li>
        <i class="icon-home"></i>
        <router-link to="~/dashboard">MenuDefaultTitle</router-link>
        <i class="fa fa-angle-right"></i>
      </li>
      <li>
        <router-link to="~/PurchaseRequest/List">MenuPurchasesTitle</router-link>
        <i class="fa fa-angle-right"></i>
      </li>
      <li>
        <span>PRMaintainHeader</span>
      </li>
    </ul>
    <div class="page-toolbar"></div>
  </div>

  <div class="page-content-inner">
    <div class="row">
      <div class="col-md-12">
        <div class="portlet light bordered">
          <div class="portlet-title">
            <div class="caption">
              <span class="caption-subject font-green bold uppercase">
                PRMaintainHeader
              </span>
            </div>
          </div>
          <div class="portlet-body form">
            <div class="form-horizontal">
              <div class="form-body">
                <div id="divMsgMessage">
                  <div id="alertmsg" class="alert alert-danger" v-if="alertVisible">
                    <button type="button" @click="hideDivMSG" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <span id="lblMsg">alertMessage</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="">
                      <span class="control-label col-md-4 require">
                        PurchaseRequest
                      </span>
                      <div class="col-md-7">
                        <input type="text" id="txtPRNo" v-model="prNo" class="form-control"
                          :readonly="autoGenerateNumber" />
                      </div>
                    </div>
                    <div class="control-label tooltipbz control-inline">
                      <i type="button" class="icon-settings" data-toggle="modal" data-target="#DocSettingModal"></i>
                      <span class="tooltiptext">DocNoSetting</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="">
                      <span class="col-md-4 require">
                        IssueDate
                      </span>
                      <div class="col-md-7">
                        <div class="input-group date">
                          <input type="text" class="form-control datepicker" v-model="stringPRDate" readonly />
                          <div class="input-group-addon">
                            <span class="pi pi-calendar"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">Vendor</span>
                      <div class="col-md-7">
                        <select v-model="vendorSelect" class="form-control select2 ddlVendor">
                          <option v-for="vendor in ddlVendor" :key="vendor.value" :value="vendor.value">{{ vendor.text
                            }}</option>
                        </select>
                        <span v-if="vendorCurrencyCode" id="lblVendorCurrency" class="label label-success"
                          style="margin-top:5px">{{ vendorCurrencyCode }}</span>
                        <span id="hplVendorAddress" class="fa fa-map-marker hide"
                          data-original-title="<b>Address"></span>
                        <div class="popover-content" style="display: none">
                          <div class="billingaddress">
                            <label id="lblVendorAddress" style="font-size:12px;margin-top:5px" class="water"
                              v-html="vendorAddressHtml"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div>
                      <span class="col-md-4">ReferenceNo</span>
                      <div class="col-md-7">
                        <input v-model="referenceNo" class="form-control" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">
                        LeadTime
                        (Day)
                      </span>
                      <div class="col-md-7">
                        <input v-model="leadTime" class="form-control text-right" readonly />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div>
                      <span class="col-md-4">
                        RequireDate</span>
                      <div class="col-md-7">
                        <div class="input-group date">
                          <input v-model="stringDeliveryDate" class="form-control datepicker" readonly />
                          <div class="input-group-addon">
                            <span class="fa fa-calendar"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">
                        PIC</span>
                      <div class="col-md-7">
                        <select v-model="picSelect" class="form-control select2">
                          <option v-for="pic in ddlPIC" :key="pic.value" :value="pic.value">{{ pic.text }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">
                        Project</span>
                      <div class="col-md-7">
                        <select v-model="projectSelect" class="form-control select2">
                          <option v-for="project in ddlProject" :key="project.value" :value="project.value">{{
                            project.text }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">ShippingAddress</span>
                      <div class="col-md-7">
                        <select v-model="shippingAddressSelect" class="form-control select2">
                          <option v-for="address in ddlShippingAddress" :key="address.value" :value="address.value">{{
                            address.text }}</option>
                        </select>
                        <label id="lblShippingAddress"></label>
                        <input type="hidden" id="lblCompanyAddressID" />
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div>
                      <span class="control-label col-md-4">Department</span>
                      <div class="col-md-7">
                        <select v-model="departmentSelect" class="form-control select2">
                          <option v-for="department in ddlDepartment" :key="department.value" :value="department.value">
                            {{ department.text }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="table-responsive" style="overflow-x:visible">
                    <table class="table table-hover table-striped sorted_table" id="prList"
                      style="border-collapse: collapse;">
                      <thead>
                        <tr class="edit-list-header" role="row">
                          <th width="10px" style="text-align:center"></th>
                          <th style="text-align:center">LineNo</th>
                          <th style="text-align: center; width: 100px;">ImageCol'</th>
                          <th style="text-align: center; min-width: 100px;">
                            lblItemCodeCol</th>
                          <th style="text-align: center; min-width: 200px;">
                            lblItemNameCol</th>
                          <th style="text-align: center; width: 150px;">RequiredDate
                          </th>
                          <th style="text-align: center; min-width: 100px;">QtyCol</th>
                          <th style="text-align: center; min-width: 100px;">UOM</th>
                          <th style="text-align: center; min-width: 150px;">UnitCost</th>
                          <th style="text-align:center">VatCol</th>
                          <th width="110px" style="text-align: right; min-width: 120px;">LineTotal</th>
                          <th width="10px" style="text-align:center"></th>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <div class="col-md-3">
                      <div class="input-group" v-if="showExchangeRate">
                        <label class="input-group-addon" id="lblExchangeRate">1 {{ vendorCurrencyCode }}</label>
                        <input v-model="exchangeRate" type="text" class="form-control text-right"
                          id="txtExchangeRate" />
                        <span class="input-group-addon" id="lblBaseCurrency">{{ companyCurrencyCode }}</span>
                      </div>
                    </div>
                    <div class="col-md-9 text-right">
                      <button @click="addItem" class="btn btn-success" id="btnAddItem">
                        <i class="fa fa-plus-circle"></i>
                        AddItem
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-5">
                    <span class="control-label">Remark</span>
                    <textarea v-model="notes" class="form-control" id="note" rows="8" cols="50"></textarea>
                  </div>
                  <div class="col-md-5 col-md-offset-2">
                    <div class="row" style="margin-top:5px">
                      <span class="control-label col-md-7">SubTotal</span>
                      <div class="col-md-5">
                        <input v-model="subtotal" type="text" class="form-control plaintext text-right" readonly />
                      </div>
                    </div>
                    <div class="row bz-subtotal" style="margin-top:5px" v-if="showDiscount">
                      <span class="control-label col-md-7">Discount</span>
                      <div class="col-md-5">
                        <input v-model="discountRate" type="text" class="form-control text-right"
                          @keypress="keyRestricted($event, false)" style="width:30%;display: inline !important;"
                          id="txtDiscountRate" />
                        %
                        <input v-model="discountAmount" type="text" class="form-control text-right"
                          @keypress="keyRestricted($event, false)" style="width:60%;display: inline !important;"
                          id="txtDiscountAmount" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="control-label col-md-7">Tax</span>
                      <div class="col-md-5">
                        <!-- <input v-model="taxAmount" type="text" class="form-control plaintext text-right" readonly
                            value="0" /> -->
                      </div>
                    </div>
                    <div class="row" style="margin-top:5px">
                      <span class="control-label col-md-7">OtherCharges</span>
                      <div class="col-md-5">
                        <input v-model="otherCharges" type="text" class="form-control text-right"
                          @keypress="keyRestricted($event, false)" />
                      </div>
                    </div>
                    <div class="row" style="margin-top:5px">
                      <div class="col-md-7">
                        <input v-model="adjustmentLabel" type="text" class="form-control"
                          style="border: dashed 2px #e5e5e5" />
                      </div>
                      <div class="col-md-5">
                        <input v-model="adjustment" type="text" class="form-control text-right"
                          @keypress="keyRestricted($event, false, true)" />
                      </div>
                    </div>
                    <div class="row bz-total well" style="padding:0">
                      <span class="control-label col-md-7 bold">GrandTotal</span>
                      <div class="col-md-5 bold">
                        <input v-model="totalAmount" type="text" class="form-control plaintext text-right" readonly />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-5 col-md-offset-7 savebuttons">
                    <div class="text-right">
                      <a id="btnSave" class="bz-btn blue" @click="save">Save</a>
                      <a v-if="hasApprovePermission" id="btnSaveAndApprove" class="bz-btn blue" @click="saveAndApprove">
                        SaveAndApprove
                      </a>
                      <a id="btnCancel" class="bz-btn grey" @click="cancel">Cancel</a>
                    </div>
                  </div>
                </div>

                <!-- Modals -->
                <div id="imgModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-body">
                        <img :src="popupImage" class="img-responsive" id="popupimg" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="VendorModal" role="dialog" aria-hidden="true" tabindex="-1"
                  style="display: none; overflow-y: hidden">
                  <div class="modalvendor modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title">CreateNewVendor</h4>
                      </div>
                      <div class="modal-body">
                        <div class="slimScrollDiv" style="position: relative; overflow-x: hidden; width: auto;">
                          <div class="scroller" style="overflow: hidden; width: auto;" data-always-visible="1"
                            data-rail-visible1="1" data-initialized="1">
                            <table class="table">
                              <tr>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px"
                                  class="requiredField">
                                  <span class="require">VendorCode</span>
                                </th>
                                <td>
                                  <input type="text" v-model="vendorCode" class="form-control txtVendorCode"
                                    maxlength="20" title="รหัสผู้ขาย" />
                                </td>
                                <th class="requiredField"
                                  style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                                  <span class="require">CompanyName</span>
                                </th>
                                <td>
                                  <input type="text" v-model="vendorCompanyName"
                                    class="form-control txtVendorCompanyName" maxlength="70" />
                                </td>
                              </tr>
                              <tr>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">TaxID</th>
                                <td>
                                  <input type="text" v-model="vendorTaxID" class="form-control txtVendorTaxID"
                                    maxlength="13" />
                                </td>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">Branch</th>
                                <td>
                                  <input type="text" v-model="branchCode" class="form-control txtBranchCode"
                                    maxlength="50" />
                                </td>
                              </tr>
                              <tr>
                                <th class="requiredField"
                                  style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                                  <span class="require">Currency</span>
                                </th>
                                <td>
                                  <select v-model="vendorCurrency" class="select2 ddlVendorCurrency">
                                  </select>
                                </td>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">Email</th>
                                <td>
                                  <input type="text" v-model="email" class="form-control txtEmail" maxlength="100" />
                                </td>
                              </tr>
                              <tr>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">Telephone1</th>
                                <td>
                                  <input type="text" v-model="tel1" class="form-control txtTel1" maxlength="30" />
                                </td>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">Telephone2</th>
                                <td>
                                  <input type="text" v-model="tel2" class="form-control txtTel2" maxlength="30" />
                                </td>
                              </tr>
                              <tr>
                                <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">Fax</th>
                                <td>
                                  <input type="text" v-model="fax" class="form-control txtFax" maxlength="30" />
                                </td>
                              </tr>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="createVendor">Create</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <table>
                    <tr v-if="subscriptionPlanID != null && subscriptionPlanID > 2">
                      <td colspan="4" style="height: 24px;"></td>
                    </tr>
                    <tr v-if="subscriptionPlanID != null && subscriptionPlanID > 2" style="height: 32px;">
                      <td colspan="4" style="background-color: #f5f5f5; padding: 8px;">
                        <span style="font-weight: bold">AccountCode</span>
                      </td>
                    </tr>
                    <tr v-if="subscriptionPlanID != null && subscriptionPlanID > 2">
                      <td colspan="4" style="height: 24px;"></td>
                    </tr>
                    <tr v-if="subscriptionPlanID != null && subscriptionPlanID > 2">
                      <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span>AccountPayable</span>
                      </th>
                      <td>
                        <select id="ddlAccountTypeAPA" class="form-control select2">
                          <!-- Options for account type will be dynamically generated here -->
                        </select>
                      </td>
                      <td colspan="2"></td>
                    </tr>

                    <tr>
                      <td colspan="4" style="height: 24px;"></td>
                    </tr>
                    <tr style="height: 32px;">
                      <td colspan="4" style="background-color: #f5f5f5; padding: 8px;">
                        <span style="font-weight: bold">Address</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" style="height: 24px;"></td>
                    </tr>
                    <tr>
                      <th class="requiredField" style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span class="require">Address1</span>
                      </th>
                      <td>
                        <textarea v-model="address1" class="form-control txtAddress1" rows="4" maxlength="255"
                          placeholder="No., Building floor, Moo, Soi"></textarea>
                        <span v-if="!isAddress1Valid" style="color: red;">ErrInputAddress1
                        </span>
                      </td>
                      <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span>Address2</span>
                      </th>
                      <td>
                        <textarea v-model="address2" class="form-control txtAddress2" rows="4" maxlength="255"
                          placeholder="Street, Tambon/Kwang"></textarea>
                      </td>
                    </tr>
                    <tr>
                      <th class="requiredField" style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span class="require">District</span>
                      </th>
                      <td>
                        <input v-model="district" type="text" class="form-control txtDistrict" maxlength="50" />
                        <span v-if="!isDistrictValid" style="color: red;">ErrInputDistrict
                        </span>
                      </td>
                      <th class="requiredField" style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span class="require">Province</span>
                      </th>
                      <td>
                        <input v-model="province" type="text" class="form-control txtProvince" maxlength="50" />
                        <span v-if="!isProvinceValid" style="color: red;">ErrInputProvince
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th class="requiredField" style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span class="require">ZipCode</span>
                      </th>
                      <td>
                        <input v-model="zipCode" type="text" class="form-control txtCode" maxlength="30" />
                      </td>
                      <th style="text-align: right; padding-bottom: 20px; padding-right: 20px">
                        <span>Country</span>
                      </th>
                      <td>
                        <select v-model="country" class="form-control select2 ddlCountryVendor">
                          <!-- Options for countries will be dynamically generated here -->
                        </select>
                      </td>
                    </tr>
                  </table>

                  <div class="modal-footer">
                    <button type="button" class="btn bz-btn blue" id="btnSaveVendor" @click="saveVendor">Save</button>
                    <button type="button" class="btn bz-btn grey" @click="closeModal">Close
                    </button>
                  </div>
                </div>
                <template>
                  <div id="ItemModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" style="margin: 0px auto">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                          <h4 class="modal-title">CreateNewItem</h4>
                        </div>
                        <div class="modal-body">
                          <input type="hidden" v-model="hiddenRowTable" />
                          <div class="slimScrollDiv"
                            style="position: relative; overflow: auto; width: auto; height: 400px;">
                            <div class="scroller" style="height: 550px; overflow: hidden; width: auto;">
                              <div class="row">
                                <label class="control-label col-sm-4 require">ItemCode
                                </label>
                                <div class="col-sm-8">
                                  <input type="text" v-model="itemCode" class="form-control" />
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4 require">ItemName
                                </label>
                                <div class="col-sm-8">
                                  <input type="text" v-model="itemName" class="form-control" />
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4 require">ItemType
                                </label>
                                <div class="col-sm-8">
                                  <select v-model="itemType" class="form-control select2">
                                    <!-- Options for item types will be dynamically generated here -->
                                  </select>
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4">UnitPrice</label>
                                <div class="col-sm-8">
                                  <input type="text" v-model="unitPrice" class="form-control"
                                    @keypress="keyRestricted($event)" />
                                </div>
                              </div>
                              <div class="row">
                                <div class="form-group">
                                  <label class="control-label col-sm-4">Tax</label>
                                  <div class="col-sm-8">
                                    <select v-model="tax" class="form-control select2">
                                      <!-- Options for tax will be dynamically generated here -->
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4">UnitCost</label>
                                <div class="col-sm-8">
                                  <input type="text" v-model="unitCost" class="form-control"
                                    @keypress="keyRestricted($event)" />
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4 require">UOM</label>
                                <div class="col-sm-8">
                                  <select v-model="baseUOM" class="form-control select2">
                                    <!-- Options for UOM will be dynamically generated here -->
                                  </select>
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4 require">TrackStock
                                </label>
                                <div class="col-sm-8">
                                  <input type="radio" v-model="trackStock" value="true" id="trackstock" checked />
                                  TrackStock
                                  <input type="radio" v-model="trackStock" value="false" id="untrackstock" />
                                  NotTrackStock
                                </div>
                              </div>
                              <div class="row">
                                <label class="control-label col-sm-4">InitialQty</label>
                                <div class="col-sm-8">
                                  <input type="text" v-model="initialQty" class="form-control"
                                    @keypress="keyRestricted($event)" />
                                </div>
                              </div>
                            </div>
                            <div class="slimScrollBar"
                              style="background: rgb(187, 187, 187); width: 7px; position: absolute; top: 0px; opacity: 0.4; display: none; border-radius: 7px; z-index: 99; right: 1px; height: 350px;">
                            </div>
                            <div class="slimScrollRail"
                              style="width: 7px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 7px; background: rgb(234, 234, 234); opacity: 0.2; z-index: 90; right: 1px;">
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn bz-btn blue" @click="saveCreateNewItem">Save</button>
                          <button type="button" data-dismiss="modal" class="btn bz-btn grey">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setuo lang="ts">
import { ref } from 'vue';

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

.modalvendor {
  z-index: 10051;
  width: 900px !important;
  margin: 0px auto;
}

.dialogModel {
  overflow-x: visible !important;
  overflow-y: visible !important;
}

.calendars-popup {
  z-index: 10055 !important;
}

table th {
  white-space: nowrap;
}
</style>
