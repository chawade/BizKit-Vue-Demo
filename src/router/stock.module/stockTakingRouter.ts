import Detail from '@/views/StockTaking/Detail.vue';
import List from '@/views/StockTaking/List.vue';
import Maintain from '@/views/StockTaking/Maintain.vue';

export const stockTakingRouter = [
    {
        path: '/StockTaking/List',
        name: 'StockTakingList',
        meta: { module: 'Inventory', breadcrumb: 'Stock Taking' },
        component: List
    },
    {
        path: '/StockTaking/Detail/:id',
        name: 'StockTakingDetail',
        meta: { parent: 'StockTakingList', breadcrumb: 'Stock Taking Detail' },
        component:  Detail,
        props: true,
    },
    {
        path: '/StockTaking/Maintain/:id?',
        name: 'StockTakingMaintain',
        meta: { parent: 'StockTakingList', breadcrumb: 'Add/Edit Stock Taking' },
        component: Maintain,
        props: true,
    }
]