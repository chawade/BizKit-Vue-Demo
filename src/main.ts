// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Router from './Router/stockTakingRouter'

const app = createApp(App);

// Use the router instance
app.use(Router);

// Mount the app to the #app element
app.mount('#app');
