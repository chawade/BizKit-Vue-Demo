<script lang="ts" setup>
import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';
import type { MenuItem } from 'primevue/menuitem';
import Menu from 'primevue/menu';

const router = useRouter();
const menu = ref<InstanceType<typeof Menu> | null>(null);
const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();
const confirm = useConfirm();
const toast = useToast();

const overlayMenuItems = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
            router.push('/dashboard');
        }
    },
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: async () => {
            console.log('Logout button clicked');
            var confirm = await openDialog();
            console.log('Confirm dialog result:', confirm);
            if (!confirm) {
                localStorage.removeItem("authToken");
            } else {
                console.log('Logout cancelled');
            }
        }
    }
]);

const openDialog = ():any => {
    confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Save'
        },
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            router.push({ name: "login" });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};

const toggleMenu = (event: Event) => {
    menu.value?.toggle(event);
};
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- SVG path data omitted for brevity -->
                </svg>
                <span>SAKAI</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button" class="layout-topbar-action layout-topbar-action-highlight">
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action" @click="toggleMenu">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <Menu ref="menu" :model="overlayMenuItems" :popup="true" />
                </div>
            </div>
        </div>
    </div>
</template>