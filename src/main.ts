import "@/assets/stlye.css";
import "@/assets/tailwind.css";

import { createApp } from "vue";
import type { App as VueApp } from 'vue';
import App from "./App.vue";
import router from "./Router/index";

import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import Breadcrumb from "primevue/breadcrumb";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Menu from "primevue/panelmenu";
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
const app: VueApp = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue components
const components = {
  InputGroup,
  Menu,
  InputText,
  Button,
  Column,
  DataTable,
  Breadcrumb,
  Checkbox,
  Password
};

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.mount("#app");