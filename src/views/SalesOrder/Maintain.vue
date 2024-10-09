<template>
  <div v-if="loading" class="justify-center"
    style="width: 100%; height: 100%; text-align: center; vertical-align: middle;">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent" animationDuration=".5s"
      aria-label="Custom ProgressSpinner" />
  </div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div class="flex flex-col gap-x-20 lg:flex-row w-full">
      <!-- Left Card -->
      <div class="flex flex-col w-full">
        <Card class="w-full">
          <template #title>
            <div class="portlet-title">
              <div class="caption">
                <span class="uppercase font-bold text-primary" style="font-size: 1.2rem;">Sales Order</span>
              </div>
            </div>
          </template>
          <template #content>
            <form @submit.prevent="">
              <div class="card flex justify-center">
                <div class="flex flex-col gap-2">
                  <label for="username">Customer</label>
                  <Select v-model="selectCustomer" filter placeholder="Select a Customer" class="w-full md:w-56">
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="flex items-center">
                        <img :alt="slotProps.value.label"
                          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                          :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.value.name }}</div>
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex items-center">
                        <img :alt="slotProps.option.label"
                          src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                          :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                      </div>
                    </template>
                  </Select>
                  <small id="username-help">Enter your username to reset your password.</small>
                </div>
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SalesOrderService from '@/Service/salesorderService';
import type { SalesOrderResource, SalesOrderSaveResource, SalesOrderSearch } from '@/Model/SalesOrder';
import type { PickingSearch } from '@/Model/Picking';
import { useToast } from 'primevue/usetoast';
import type { CustomerResource } from '@/Model/Customer';
import CustomerService from '@/Service/CustomerService';

const salesOrder = ref<SalesOrderResource>();
const toast = useToast();
const loading = ref(false);
const error = ref('');
const SkipPick = ref(false);
const route = useRoute();
const SalesOrderNo: string = String(route.params.id);
const custoemrId = ref(0);
const selectCustomer = ref<CustomerResource>();
  const salesOrderSave = reactive<SalesOrderSaveResource>({
    SalesOrderID: 0,
    SalesOrderNumber: '',
    SalesOrderDate: new Date(), // Correct initialization for Date
    AssociatedSONo: '',
    Customer: {}, // Assuming Customer is optional or nullable
    WarehouseID: 0,
    ReferenceNo: '', // Correct initialization as string
    RefQuotationNo: '', // Correct initialization as string
    PaymentTerm: {}, // Assuming any, adjust according to actual type
    DeliveryDate: new Date(), // Correct initialization as Date
    PersonInCharge: '', // Corrected typo and initialized as string
    Currency: '',
    DiscountRate: 0,
    DiscountAmount: 0,
    OtherCharges: 0,
    Status: {}, // Assuming Status is optional
    PickStatus: 0,
    PackStatus: 0,
    ShipStatus: 0,
    IsBackOrder: false,
    IsSplitOrder: false,
    Notes: '',
    InternalMemo: '',
    MemoDate: new Date(),
    MemoBy: '',
    IsPriceExcludeVat: false,
    SalesOrderItemResource: []
});
const fetchData = async () => {
  // try {
  //   loading.value = true;
  //   const response = await SalesOrderService.get(SalesOrderNo);

  //   salesOrder.value = response.Data as SalesOrderResource;
  //   SkipPick.value = salesOrder.value.SkipPicking;
  // } catch (err: any) {
  //   toast.add({ severity: 'error', summary: 'Failed to fetch stock taking data', detail: error, life: 3000 });
  // } finally {
  //   loading.value = false;
  // }
};

// const getDDLCustomer = async () =>{
//   const response = await CustomerService.ddlCustomer(custoemrId.value);
// }

onMounted(() => {
  if(SalesOrderNo != '')
    fetchData()
  
  // getDDLCustomer();
})
</script>

