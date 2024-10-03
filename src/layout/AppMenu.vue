<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/StockTaking/Detail/74' }]
    },
    {
        label: 'Inventory',
        items: [
            {
                label: 'Stock Taking',
                icon: 'pi pi-fw pi-book',
                to: '/StockTaking/List'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style scoped>
.layout-menuitem-category {
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
}

.layout-menuitem-category:first-child {
    margin-top: 0;
}

.layout-menu ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.layout-menu ul li {
    margin-left: 0;
}
</style>