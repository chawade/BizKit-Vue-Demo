<template>
    <div>
      <div id="alertmsg" class="alert alert-danger" v-if="showAlert">
        <button type="button" @click="hideDivMSG" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <span id="lblMsg">{{ alertMsg }}</span>
      </div>
  
      <table>
        <tbody id="prList">
          <tr v-for="(item, index) in stockItems" :key="index">
            <td style="text-align:center">
              <input v-model="item.actualQty" @change="onActualQtyChange(item)" type="number" class="txtActualQty" />
            </td>
            <td>
              <span>{{ formatNumber(item.diff, '.', ',', qtyDecPlaces) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
  
      <button @click="saveStockTaking('DRAFT')" id="btnSave">Save</button>
      <button @click="saveStockTaking('PLANNED')" id="btnSavePlan">Save Plan</button>
      <button @click="saveStockTaking('APPROVED')" id="btnSaveAndApprove">Save and Approve</button>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    data() {
      return {
        showAlert: false,
        alertMsg: '',
        qtyDecPlaces: 2,
        stockItems: [],
        oldWarehouseId: 0,
        oldLocationId: 0,
        warehouseId: 0,
        locationId: 0,
        takingDate: '',
        status: 'DRAFT',
      };
    },
    methods: {
      hideDivMSG() {
        this.showAlert = false;
      },
      formatNumber(number, decimalSeparator, thousandSeparator, decimalPlaces) {
        return number.toFixed(decimalPlaces).replace(/\d(?=(\d{3})+\.)/g, `$&${thousandSeparator}`);
      },
      onActualQtyChange(item) {
        item.diff = item.actualQty - item.onHandQty;
      },
      saveStockTaking(status) {
        this.validateStockTaking();
  
        if (this.validateTable()) {
          this.status = status;
          this.submitStockTaking();
        } else {
          this.showAlert = true;
          this.alertMsg = 'Please fill required fields.';
        }
      },
      validateStockTaking() {
        let isValid = true;
        if (!this.takingDate) {
          this.alertMsg = 'Stock Taking Date is required.';
          isValid = false;
        }
        if (this.warehouseId === 0) {
          this.alertMsg = 'Warehouse is required.';
          isValid = false;
        }
        if (!this.PIC) {
          this.alertMsg = 'PIC is required.';
          isValid = false;
        }
        return isValid;
      },
      validateTable() {
        return this.stockItems.every((item) => item.actualQty !== null && item.actualQty !== '');
      },
      submitStockTaking() {
        // Logic to submit stock-taking data to the server
        // Implement your form submission here, e.g., using axios
      },
      async getStockItems(warehouseId, locationId) {
        try {
          const response = await axios.post('/StockTaking/GetStockItemForTaking', {
            warehouseId,
            locationId,
          });
          this.stockItems = response.data.items;
        } catch (error) {
          console.error('Error fetching stock items:', error);
        }
      },
    },
    mounted() {
      // Initial fetch or any setup can go here
      this.getStockItems(this.warehouseId, this.locationId);
    },
  };
  </script>
  
  <style scoped>
  /* Add your custom styles here */
  </style>
  