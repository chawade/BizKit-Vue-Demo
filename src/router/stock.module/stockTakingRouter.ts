import Detail from '@/views/stockTaking/Detail.vue';
import List from '@/views/stockTaking/List.vue';
import Maintain from '@/views/stockTaking/Maintain.vue';

export const stockTakingRouter = [
    {
        path: '/StockTaking/List',
        name: 'StockTaking',
        meta: { module: 'Inventory', breadcrumb: 'Stock Taking' },
        component: List
    },
    {
        path: '/StockTaking/Detail/:id',
        name: 'StockTakingDetail',
        meta: { parent: 'StockTaking', breadcrumb: 'Stock Taking Detail' },
        component:  Detail,
        props: true,
    },
    {
        path: '/StockTaking/Maintain/:id?',
        name: 'StockTakingMaintain',
        meta: { parent: 'StockTaking', breadcrumb: 'Add/Edit Stock Taking' },
        component: Maintain,
        props: true,
    }
]