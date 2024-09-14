<template>
    <div class="status-badge">
        <div v-if="status === 'Отложена'"
            class="flex align-items-center justify-content-center bg-green-100 border-round" style="padding: 10px">
            <i class="pi pi-spin pi-spinner" style="font-size: 12px"></i>
        </div>
        <div v-if="status === 'Опубликована'"
            class="flex align-items-center justify-content-center bg-green-100 border-round" style="padding: 10px">
            <i class="pi pi-check text-white-200 text" style="font-size: 12px"></i>
        </div>
        <div v-if="status === 'Ожидание'"
            class="flex align-items-center justify-content-center bg-orange-100 border-round" style="padding: 10px">
            <i class="pi pi-clock text-white-200 text" style="font-size: 12px"></i>
        </div>
        <div v-if="status === 'Ошибка'" class="flex align-items-center justify-content-center bg-red-100 border-round"
            style="padding: 10px">
            <i class="pi pi-times text-white-200 text" style="font-size: 12px"></i>
        </div>
        <div v-if="status === 'Неизвестно'"
            class="flex align-items-center justify-content-center bg-gray-100 border-round" style="padding: 10px">
            <i class="pi pi-question text-white-200 text" style="font-size: 12px"></i>
        </div>
        <div v-if="!status" class="flex align-items-center justify-content-center bg-gray-200 border-round"
            style="padding: 10px">
            <i class="pi pi-info text-white-200 text" style="font-size: 12px"></i>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    status: {
        type: String,
        default: '',
        validator: (value) => ['Опубликована', 'Ожидание', 'Ошибка', 'Неизвестно'].includes(value),
    }
});

const emit = defineEmits([]);
</script>

<style scoped>
.status-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 4px;
}
</style>