import { createRouter, createWebHistory } from 'vue-router';

import Detail from '../components/Detail.vue'
import List from '../components/List.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/StockTaking/List',
            name: 'StockTakingList',
            component: List
        },
        {
            path: '/StockTaking/Detail/:id',
            name: 'Employees',
            component: Detail,
            props: true,
        }
    ]
});

export default router;