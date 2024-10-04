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
                    meta: { module: 'Inventory', breadcrumb: 'Stock Taking Detail' },
                    component: () => import('@/views/StockTaking/Detail.vue'),
                    props: true,
                },
                {
                    path: '/StockTaking/Maintain/:id',
                    name: 'StockTakingMaintain',
                    meta: { module: 'Inventory', breadcrumb: 'Add/Edit Stock Taking' },
                    component: () => import('@/views/StockTaking/Maintain.vue'),
                    props: true,
                },
                {
                    path: '/StockTaking/Maintain/',
                    name: 'AddStockTaking',
                    meta: { module: 'Inventory', breadcrumb: 'Add/Edit Stock Taking' },
                    component: () => import('@/views/StockTaking/Maintain.vue'),
                    props: true,
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken');
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