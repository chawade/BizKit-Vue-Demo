<template>
    <div class="row mb-8 flex justify-between">
        <div class="col-sm-8 flex gap-2">
            <Button v-for="action in actions" :key="action.label" :label="action.label" :severity="action.severity"
                @click="$emit(action.event)" />
            <slot name="additional-buttons"></slot>
        </div>
        <div class="col-sm-4 text-right">
            <slot name="create-button">
                <router-link :to="createRoute">
                    <Button icon="pi pi-plus-circle" :label="createButtonLabel" severity="success" />
                </router-link>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Action {
    label: string;
    severity: string;
    event: string;
}

defineProps<{
    actions: Action[];
    createRoute: string;
    createButtonLabel: string;
}>();

defineEmits<{
    [key: string]: (...args: any[]) => void;
}>();
</script>