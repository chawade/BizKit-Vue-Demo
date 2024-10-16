import AppLayout from '@/layout/AppLayout.vue'
import authService from '@/service/authService';
import { ref } from 'vue';
import { createRouter, createWebHistory, useRoute, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router';

export const isLoading = ref(false);

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
                    name: 'StockTaking',
                    meta: { module: 'Inventory', breadcrumb: 'Stock Taking' },
                    component: () => import('@/views/stockTaking/List.vue')
                },
                {
                    path: '/StockTaking/Detail/:id',
                    name: 'StockTakingDetail',
                    meta: { parent: 'StockTaking', breadcrumb: 'Stock Taking Detail' },
                    component: () => import('@/views/stockTaking/Detail.vue'),
                    props: true,
                },
                {
                    path: '/StockTaking/Maintain/:id?',
                    name: 'StockTakingMaintain',
                    meta: { parent: 'StockTaking', breadcrumb: 'Add/Edit Stock Taking' },
                    component: () => import('@/views/stockTaking/Maintain.vue'),
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
                  }
            ]
        }
    ]
});


router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    isLoading.value = true;
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

router.afterEach(() => {
    // Stop loading after route is finished
    isLoading.value = false;
});


export default router;
