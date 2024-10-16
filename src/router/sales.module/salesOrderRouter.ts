import Detail from '@/views/SalesOrder/Detail.vue';
import List from '@/views/SalesOrder/List.vue';
import Maintain from '@/views/SalesOrder/Maintain.vue';

export const salesOrderRouter = [
    {
        path: '/SalesOrder/List',
        name: 'SalesOrder',
        meta: { module: 'SalesOrder', breadcrumb: 'Sales Order' },
        component: List,
        props: true,
    },
    {
        path: '/SalesOrder/Detail/:id',
        name: 'SalesOrderDetail',
        meta: { parent: 'SalesOrder', breadcrumb: 'Sales Order Detail' },
        component: Detail,
        props: true,
    },
    {
        path: '/SalesOrder/Maintain/:id?',
        name: 'SalesOrderMaintain',
        meta: {
            parent: 'SalesOrder', breadcrumb: 'Add/Edit Sales Order'
        },
        component: Maintain,
        props: true,
    }
];