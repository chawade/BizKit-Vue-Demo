<template>
    <div class="row">
      <div :class="columnClass">
        <div class="portlet box">
          <div class="portlet-title">
            <div class="caption">
              <span class="invoice-title uppercase">{{ title }}</span>
            </div>
          </div>
          <div class="portlet-body">
            <slot>{{ remark }}</slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  defineProps<{
    title: string;
    remark?: string;
    columnClass?: string;
  }>();
  </script>
  
  <style scoped>
  </style>