<script lang="ts" setup>
import { useLayout } from './composables/layout';
import { computed, provide, ref, watch } from 'vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import Title from './Title.vue';
import Landing from '@/pages/Landing.vue';
import { isLoading } from '@/router';
import FooterButton from './FooterButton.vue';
import { useRoute } from 'vue-router';
import { RouterView } from 'vue-router'

const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();
const outsideClickListener = ref<((event: MouseEvent) => void) | null>(null);
const stickyButtons = ref([]);
const route = useRoute();

const setStickyButtons = (buttons:any) => {
  stickyButtons.value = buttons;
};

provide('setStickyButtons', setStickyButtons);

// Watch for route changes to reset sticky buttons
watch(() => route.path, () => {
  stickyButtons.value = [];
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event: MouseEvent) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event: MouseEvent): boolean {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl?.isSameNode(event.target as Node) || sidebarEl?.contains(event.target as Node) || topbarEl?.isSameNode(event.target as Node) || topbarEl?.contains(event.target as Node));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="relative">
            <!-- Loading Spinner and BlockUI -->
            <div v-if="isLoading"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000]">
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" animationDuration=".5s"
                    aria-label="Loading" />
                <BlockUI fullScreen />
            </div>

            <!-- Main Content -->
            <div class="layout-main-container">
                <div class="layout-main">
                    <app-topbar></app-topbar>
                    <app-sidebar></app-sidebar>
                    <Title />
                    <Toast />
                    <ConfirmDialog></ConfirmDialog>
                    <router-view></router-view>
                </div>
                <app-footer class="app-footer"></app-footer>            
            </div>
            <!-- Conditional Sticky Buttons -->
            <FooterButton :buttons="stickyButtons"></FooterButton>
        </div>
    </div>
</template>