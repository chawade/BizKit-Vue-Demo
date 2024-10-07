<template>
    <div>
        <h3 class="font-bold text-xl mb-8">{{ title }}</h3>
    </div>
    <Breadcrumb :model="breadcrumb" class="card">
        <template #item="{ item, props }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="[item.icon, 'text-color']"></span>
                    <span class="text-primary font-semibold">{{ item.label }}</span>
                </a>
            </router-link>
            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
            </a>
        </template>
    </Breadcrumb>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface BreadcrumbItem {
    label?: string;
    icon?: string;
    url?: string;
    route?: string;
    target?: string;
}

const route = useRoute();
const router = useRouter();

const title = ref<string>('');

const breadcrumb = computed<BreadcrumbItem[]>(() => {
    const breadcrumbItems: BreadcrumbItem[] = [];

    breadcrumbItems.push({ icon: 'pi pi-home', route: '/' });

    route.matched.forEach((matchedRoute) => {
        if (matchedRoute.meta.parent) {
            const parentRoute = router.resolve({ name: String(matchedRoute.meta.parent) });

            const parentMatchedRoute = parentRoute.matched.find(route => route.name === matchedRoute.meta.parent);

            if (parentMatchedRoute && parentMatchedRoute.meta.breadcrumb) {
                breadcrumbItems.push({
                    label: String(parentMatchedRoute.meta.breadcrumb),
                    url: parentRoute.href,
                });
            }
        }

        if (matchedRoute.meta.module) {
            breadcrumbItems.push({
                label: String(matchedRoute.meta.module),
                url: matchedRoute.path,
            });
        }

        if (matchedRoute.meta.breadcrumb) {
            const currentRoute = router.resolve({ name: matchedRoute.name, params: route.params });
            breadcrumbItems.push({
                label: String(matchedRoute.meta.breadcrumb),
                route: currentRoute.href,
            });

            title.value = String(matchedRoute.meta.breadcrumb);
        }
    });

    return breadcrumbItems;
});

</script>