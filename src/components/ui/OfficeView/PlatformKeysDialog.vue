<template>
    <Dialog v-if="props.visible" v-model:visible="props.visible" maximizable modal header="Настройки офисов"
        :style="{ width: '50rem', padding: '15px' }">
        <Card v-for="(platform, index) in props.platforms" :key="index" class="mt-5">
            <template #title>{{ platform.title }}</template>
            <template #content>
                <div v-for="(field, idx) in platform.fields" :key="idx">
                    <Field :id="field.id" v-model="field.value" :label="field.label" :placeholder="field.placeholder"
                        :helpText="field.helpText" />
                </div>
            </template>
            <template #footer>
                <ActionButtons :onSubmit="() => props.setupPlatformKeys(platform.name)" :onCancel="() => props.visible = false" />
            </template>
        </Card>
        <div class="mt-3">
            <h5 style="font-weight: bold; font-size: 16px;">Сотрудники привязанные к данному офису</h5>
        </div>
        <EmployeeList :managers="props.managers" />
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Field from './Field.vue';
import ActionButtons from './ActionButtons.vue';
import EmployeeList from './EmployeeList.vue';
import { defineProps, ref } from 'vue';

const props = defineProps({
    visible: Boolean,
    platforms: Array,
    managers: Array,
    setupPlatformKeys: Function,
});

const visible = ref(props.visible);
</script>