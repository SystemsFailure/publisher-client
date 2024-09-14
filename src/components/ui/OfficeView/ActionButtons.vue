<template>
    <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
        <Button type="button" label="Отмена" severity="secondary" @click="props.onCancel"></Button>
        <Button type="button" label="Создать" @click="props.onSubmit" severity="success"></Button>
    </div>
</template>

<script setup>
import Button from 'primevue/button';
import { defineProps } from 'vue';

const props = defineProps({
    onSubmit: Function,
    onCancel: Function,
});
</script>