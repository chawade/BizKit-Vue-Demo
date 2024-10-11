<template>
  <Select :modelValue="modelValue" :options="filteredOptions" :optionLabel="optionLabel" :dataKey="dataKey"
    :placeholder="placeholder" :loading="loading" filter @filter="onFilter" @update:modelValue="onChange">
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </Select>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { SelectChangeEvent, SelectFilterEvent } from 'primevue/select';
import type { SelectItem } from '@/Model/BaseResource'; // Adjust based on actual model

interface Props {
  modelValue: SelectItem | any | null | undefined ;
  options: SelectItem[] | any[];
  optionLabel: any;
  dataKey: any;
  placeholder?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  loading: false,
  optionLabel: 'name',
  dataKey: 'code'
});

const filteredOptions = ref<SelectItem[]>(props.options);
const searchQuery = ref<string>('');

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectItem): void;
  (e: 'filter', value: string): void;
}>();

let debounceTimeout: ReturnType<typeof setTimeout>;

const onFilter = (event: SelectFilterEvent) => {
  searchQuery.value = event.value;
};

const onChange = (value: SelectItem) => {
  emit('update:modelValue', value);
};

const debouncedFilter = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (searchQuery.value.length >= 2) {
      // Type-safe filtering
      filteredOptions.value = props.options.filter(option =>
        String(option[props.optionLabel]).toLowerCase().includes(searchQuery.value.toLowerCase())
      );
      
      emit('filter', searchQuery.value);
    } else {
      filteredOptions.value = props.options;
    }
  }, 300); // 300ms debounce
};

watch(searchQuery, debouncedFilter);

// Reset filtered options when props.options change
watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions;
});
</script>