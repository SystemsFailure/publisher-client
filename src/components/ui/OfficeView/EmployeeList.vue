<template>
    <Card>
        <template #title>Сотрудники</template>
        <template #content>
            <div v-if="!props.hasManagers">Менеджеров нет</div>
            <div v-else>
                <div v-for="manager in props.managers" :key="manager._id" class="p-3 mt-1"
                    style="height: 20px; border: 1px solid #999; display: flex; align-items: center; border-radius: 3px;">
                    <div>ID: {{ manager._id }}</div>
                    <div class="ml-3">Имя: {{ manager.login }}</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import Card from 'primevue/card';
import { defineProps } from 'vue';

const props = defineProps({
    managers: Array,
    hasManagers: Boolean,
});
</script>