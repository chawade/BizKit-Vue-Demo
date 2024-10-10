<template>
    <div class="row mb-8">
      <div class="col-sm-5">
        <div class="portlet box">
          <div class="portlet-title">
            <div class="caption">
              <span class="invoice-title uppercase">{{ title }}</span>
            </div>
          </div>
          <div class="portlet-body">
            <div v-for="(value, key) in info" :key="key" class="row stattic-info">
              <span class="invoice-desc col-sm-6">{{ key }}</span>
              <span class="col-sm-6 font-normal">{{ value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  defineProps<{
    title: string;
    info: Record<string, string | number | undefined>;
  }>();
  </script>