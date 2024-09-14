<template>
    <div class="flex flex-column gap-2">
        <label :for="props.id">{{ label }}</label>
        <InputText :id="props.id" v-model.trim="props.modelValue" :aria-describedby="props.ariaDescribedBy" :placeholder="props.placeholder" />
        <small :id="props.ariaDescribedBy">{{ props.helpText }}</small>
    </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import { defineProps, computed } from 'vue';

const props = defineProps({
    id: String,
    modelValue: String,
    label: String,
    placeholder: String,
    helpText: String,
    ariaDescribedBy: String,
});

const ariaDescribedBy = computed(() => props.id + '-help');
</script>