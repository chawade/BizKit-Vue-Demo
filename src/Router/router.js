import { createRouter, createWebHistory } from 'vue-router';

import Detail from '../components/StockTaking/Detail.vue'
import List from '../components/StockTaking/List.vue'
import Maintain from '../components/StockTaking/Maintain.vue'
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
            name: 'StockTakingDetail',
            component: Detail,
            props: true,
        },
        {
            path: '/StockTaking/Maintain/:id',
            name: 'StockTakingMaintain',
            component: Maintain,
            props: true,
        },
    ]
});

export default router;