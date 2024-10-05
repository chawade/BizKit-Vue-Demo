<script lang="ts" setup>
import { onMounted } from 'vue';
import AuthService from './service/auth';
import { useRouter } from 'vue-router';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

// import AppLayout from '@/layout/AppLayout.vue'

// import test from './test.vue'

const router = useRouter();
onMounted(async () => {
    try {
        await AuthService.verifyToken();
    } catch (error:any) {
        console.error('Token verification failed:', error);
        router.push({ name: 'login' });
    }
});
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <router-view></router-view>
  <!-- <test /> -->
  <!-- <AppLayout/> -->

</template>

<style scoped></style>
