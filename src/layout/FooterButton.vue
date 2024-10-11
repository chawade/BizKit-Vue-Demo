<template>
    <div v-if="buttons.length > 0" class="w-full bg-primary py-4 sticky bottom-0 left-0 right-0 z-[1000]">
      <div class="mr-[2rem] mx-auto flex justify-end">
        <Button 
          v-for="button in buttons" 
          :key="button.label"
          :icon="button.icon"
          :label="button.label"
          :severity="button.severity"
          @click="button.action"
          class="mr-2 last:mr-0"
          raised
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import Button from 'primevue/button';
  
  const props = defineProps({
    buttons: {
      type: Array,
      default: () => []
    }
  });
  </script>