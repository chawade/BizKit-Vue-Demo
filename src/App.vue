<script lang="ts" setup>
import { onMounted } from 'vue';
import AuthService from './Service/AuthService';
import { useRouter } from 'vue-router';

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
  <router-view></router-view>

</template>

<style scoped></style>
