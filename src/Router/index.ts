import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('@/pages/auth/Login.vue')
        },
        {
            path: '/Home',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'Dashboard',
                    meta: { breadcrumb: 'Home' },
                    component: () => import('@/views/Dashboard/Dashboard.vue')
                },
                {
                    path: '/StockTaking/List',
                    name: 'StockTakingList',
                    meta: { module: 'Inventory', breadcrumb: 'Stock Taking' },
                    component: () => import('@/views/StockTaking/List.vue')
                },
                {
                    path: '/StockTaking/Detail/:id',
                    name: 'StockTakingDetail',
                    meta: { parent: 'StockTakingList', breadcrumb: 'Stock Taking Detail' },
                    component: () => import('@/views/StockTaking/Detail.vue'),
                    props: true,
                },
                {
                    path: '/StockTaking/Maintain/:id',
                    name: 'StockTakingMaintain',
                    meta: { parent: 'StockTakingList', breadcrumb: 'Add/Edit Stock Taking' },
                    component: () => import('@/views/StockTaking/Maintain.vue'),
                    props: true,
                },
                {
                    path: '/StockTaking/Maintain/',
                    name: 'AddStockTaking',
                    meta: { parent: 'StockTakingList', breadcrumb: 'Add/Edit Stock Taking' },
                    component: () => import('@/views/StockTaking/Maintain.vue'),
                    props: true,
                },
                {
                    path: '/SalesOrder/List',
                    name: 'SalesOrder',
                    meta: { module: 'SalesOrder', breadcrumb: 'Sales Order' },
                    component: () => import('@/views/SalesOrder/List.vue'),
                    props: true,
                },
                {
                    path: '/PurchaseRequest/PRList/',
                    name: 'PurchaseRequestList',
                    meta: { module: 'Purchase', breadcrumb: 'PRList' },
                    component: () => import('@/views/PurchaseRequest/PRList.vue'),
                    props: true,
                },
                {
                    path: '/PurchaseRequest/Detail/:no',
                    name: 'PurchaseRequestDetail',
                    meta: { module: 'PurchaseRequestList', breadcrumb: 'PRDetail' },
                    component: () => import('@/views/PurchaseRequest/PRDetail.vue'),
                    props: true,
                },
                {
                    path: '/PurchaseRequest/PRMaintain/',
                    name: 'PurchaseRequestSetting',
                    meta: { module: 'Purchase', breadcrumb: 'PRSetting' },
                    component: () => import('@/views/PurchaseRequest/PRMaintain.vue'),
                    props: true,
                },
                {
                    path: '/PurchaseRequest/PRListtest/',
                    name: 'PurchaseRequestListTest',
                    meta: { module: 'Purchase', breadcrumb: 'PRListtest' },
                    component: () => import('@/views/PurchaseRequest/PRListtest.vue'),
                    props: true,
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken');
    // If a module is equal to the breadcrumb, include the path of the list
    if (to.meta.module === to.meta.breadcrumb && to.meta.parent) {
        to.meta.breadcrumb = `${to.meta.module} > ${router.resolve({ name: String(to.meta.parent) }).href} > ${to.meta.breadcrumb}`;
    }
    if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
        next({ name: 'login' });
    }
    // If the user is trying to access the login page and they are already authenticated, redirect to dashboard
    else if (to.name === 'login' && token) {
        next({ name: 'Dashboard' });
    }
    // Otherwise, allow navigation
    else {
        next();
    }
});

export default router;
