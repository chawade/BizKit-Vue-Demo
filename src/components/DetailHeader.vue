<template>
  <div class="detail-head flex justify-between items-end mb-8">
    <div>
      <h1 class="uppercase font-semibold text-l text-left" style="bottom: 0;">
        <span>{{ title }}</span>
      </h1>
    </div>
    <div class="text-right">
      <h4>{{ itemNo }}</h4>
      <span v-if="status" class="status" :style="statusStyle">{{ status.StatusName }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { StatusResource } from '@/Model/Status';
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  itemNo: string;
  status: StatusResource;
}>();

const statusStyle = computed(() => {
  if (!props.status) return {};
  return {
    backgroundColor: props.status.StatusBgColor,
    color: props.status.StatusFontColor,
    border: `1px solid ${props.status.StatusBorderColor}`,
    fontSize: `${props.status.StatusFontSize}px`,
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  };
});
</script>