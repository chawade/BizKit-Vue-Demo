<template>
  <div class="detail-head flex justify-between items-end mb-8">
    <div>
      <h1 class="uppercase font-bold text-2xl text-l text-left" style="bottom: 0;">
        <span>{{ title }}</span>
      </h1>
    </div>
    <div class="text-right font-bold text-2xl">
      <h4>{{ itemNo }}</h4>
      <span v-if="statusTheme" class="min-w-28 max-w-28 text-center" :style="statusStyle">{{ status.statusName }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { StatusResource } from '@/Model/Status'; 
import StatusService from '@/service/statusService';

const props = defineProps<{
  title: string;
  itemNo: string;
  status: StatusResource;
}>();

const statusService = new StatusService();

const statusTheme = computed(() => {
  const statusId = props.status?.statusId || 0; 
  return statusService.getStatusTheme(statusId);
});

const statusStyle = computed(() => {
  return {
    backgroundColor: statusTheme.value.bgColor,
    color: statusTheme.value.fontColor,
    border: `1px solid ${statusTheme.value.borderColor}`,
    fontSize: statusTheme.value.fontSize,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  };
});
</script>
