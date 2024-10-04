<script lang="ts" setup>
import { onMounted } from 'vue';
import AuthService from './Service/auth';
import { useRouter } from 'vue-router';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

// import AppLayout from '@/layout/AppLayout.vue'

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
  <!-- <AppLayout/> -->

</template>

<style scoped></style>
