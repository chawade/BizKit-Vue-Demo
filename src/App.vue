<script lang="ts" setup>
import { onMounted } from 'vue';
import authService from './Service/authService';
import { useRouter } from 'vue-router';


const router = useRouter();
onMounted(async () => {
    try {
        await authService.verifyToken();
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
