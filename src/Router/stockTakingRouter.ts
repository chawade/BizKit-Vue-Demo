import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'List',
            component: () => import('../components/StockTaking/List.vue')
        },
        {
            path: '/StockTaking/List',
            name: 'StockTakingList',
            component: () => import('../components/StockTaking/List.vue')
        },
        {
            path: '/StockTaking/Detail/:id',
            name: 'StockTakingDetail',
            component: () => import('../components/StockTaking/Detail.vue'),
            props: true,
        },
        {
            path: '/StockTaking/Maintain/:id',
            name: 'StockTakingMaintain',
            component: () => import('../components/StockTaking/Maintain.vue'),
            props: true,
        },
    ]
});

export default router;