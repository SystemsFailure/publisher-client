<template>
    <div class="flex flex-column gap-2">
        <label :for="props.id">{{ label }}</label>
        <Dropdown v-model="props.modelValue" :options="props.options" optionLabel="name" :placeholder="props.placeholder"
            class="w-full md:w-200rem" variant="outlined" />
    </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown';
import { defineProps } from 'vue';

const props = defineProps({
    id: String,
    modelValue: [String, Number],
    options: Array,
    label: String,
    placeholder: String,
});
</script>