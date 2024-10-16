import "@/assets/stlye.css";
import "@/assets/tailwind.css";

import { createApp } from "vue";
import type { App as VueApp } from 'vue';
import App from "./App.vue";

import Aura from "@primevue/themes/aura";
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import router from "./router";
import Tooltip from 'primevue/tooltip';
import { createPinia } from "pinia";
import StyleClass from "primevue/styleclass";

const pinia = createPinia()
const app: VueApp = createApp(App);

app.use(router);
app.use(PrimeVue, {
  locale: {
    accept: 'Thailand',
  },
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});
app.directive('tooltip', Tooltip);
app.directive('styleclass', StyleClass);
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia)

app.mount("#app");
