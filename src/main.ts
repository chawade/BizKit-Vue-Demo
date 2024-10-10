import "@/assets/stlye.css";
import "@/assets/tailwind.css";

import { createApp } from "vue";
import type { App as VueApp } from 'vue';
import App from "./App.vue";

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
import Menu from "primevue/menu";
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import StyleClass from 'primevue/styleclass';
import SelectButton from "primevue/selectbutton";
import router from "./Router";
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Chart from 'primevue/chart'; 
import Paginator from "primevue/paginator";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import Panel from "primevue/panel";
import InputGroupAddon from "primevue/inputgroupaddon";
import Menubar from "primevue/menubar";
import Card from "primevue/card";
import Tabs from "primevue/tabs";
import Tab from "primevue/tab";
import TabPanel from "primevue/tabpanel";
import TabPanels from "primevue/tabpanels";
import TabList from "primevue/tablist";
import MegaMenu from "primevue/megamenu";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Badge from "primevue/badge";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import MultiSelect from "primevue/multiselect";
import Toolbar from "primevue/toolbar";
import Message from "primevue/message";
import Fluid from "primevue/fluid";
import Tooltip from 'primevue/tooltip';
import BlockUI from "primevue/blockui";
import ContextMenu from "primevue/contextmenu";
import Image from "primevue/image";

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
  Password,
  SelectButton,
  ConfirmDialog,
  Toast,
  Chart,
  Paginator,
  Tag,
  ProgressSpinner,
  Panel,
  InputGroupAddon,
  DatePicker,
  Select,
  Menubar,
  Card,
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  MegaMenu,
  ColumnGroup,
  Row,
  Badge,
  InputIcon,
  IconField,
  MultiSelect,
  InputNumber,
  Textarea,
  Toolbar,
  Message,
  Fluid,
  BlockUI,
  ContextMenu,
  Image
};

Object.entries(components).forEach(([name, component]) => {
  app.component(name, component);
});

app.mount("#app");
