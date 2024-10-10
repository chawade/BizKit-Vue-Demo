import AppLayout from '@/layout/AppLayout.vue'
import authService from '@/Service/authService';
import { createRouter, createWebHistory, useRoute, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';


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
                    path: '/SalesOrder/Detail/:id',
                    name: 'SalesOrderDetail',
                    meta: { parent: 'SalesOrder', breadcrumb: 'Sales Order Detail' },
                    component: () => import('@/views/SalesOrder/Detail.vue'),
                    props: true,
                },
                {
                    path: '/SalesOrder/Maintain/:id?',
                    name: 'SalesOrderMaintain',
                    meta: { 
                        parent: 'SalesOrder',  breadcrumb: 'Add/Edit Sales Order'
                      },
                    component: () => import('@/views/SalesOrder/Maintain.vue'),
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


router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // debugger;
    const token = localStorage.getItem('authToken');

    // Verify token on every navigation
    const isValidToken = await authService.verifyToken();

    // If a module is equal to the breadcrumb, include the path of the list
    if (to.meta.module === to.meta.breadcrumb && to.meta.parent) {
        to.meta.breadcrumb = `${to.meta.module} > ${router.resolve({ name: String(to.meta.parent) }).fullPath} > ${to.meta.breadcrumb}`;
    }

    if (to.matched.some((record) => record.meta.requiresAuth) && !isValidToken) {
        // Token is invalid or missing, redirect to login
        next({ name: 'login' });
    }
    // If the user is trying to access the login page and they have a valid token, redirect to dashboard
    else if (to.name === 'login' && isValidToken) {
        next({ name: 'Dashboard' });
    }
    // If token is invalid and user is not on login page, redirect to login
    else if (!isValidToken && to.name !== 'login') {
        next({ name: 'login' });
    }
    // Otherwise, allow navigation
    else {
        next();
    }
});

export default router;
