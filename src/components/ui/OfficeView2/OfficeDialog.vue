<template>
    <Dialog v-if="props.visible" v-model:visible="props.visible" maximizable modal header="Создание офиса"
        :style="{ width: '50rem', padding: '15px' }">
        <Card>
            <template #title>Форма заполнения данных офиса</template>
            <template #content>
                <div class="flex flex-column gap-2">
                    <label for="office-name">Название офиса</label>
                    <InputText id="office-name" v-model.trim="props.newOfficeData.name" aria-describedby="office-name-help"
                        placeholder="Название" />
                    <small id="office-name-help">Введите название</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_code">Код офиса</label>
                    <InputText id="office_code" v-model.trim="props.newOfficeData.code" aria-describedby="office_code-help" />
                    <small id="office_code-help">Введите код</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_address">Адрес офиса</label>
                    <InputText id="office_address" v-model.trim="props.newOfficeData.address"
                        aria-describedby="office_address-help" />
                    <small id="office_address-help">Введите адрес офиса</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_region">Регион</label>
                    <Dropdown v-model="props.newOfficeData.region" :options="props.regions" optionLabel="name"
                        :placeholder="'Выберите регион'" class="w-full md:w-200rem" variant="outlined" />
                </div>
            </template>
        </Card>
        <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
            <Button type="button" label="Отмена" severity="secondary" @click="closeDialog"></Button>
            <Button type="button" label="Создать" @click="createOffice" severity="success"></Button>
        </div>
    </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    visible: Boolean,
    newOfficeData: Object,
    regions: Array
});

const emit = defineEmits(['createOffice']);

const closeDialog = () => {
    emit('update:visible', false);
};

const createOffice = () => {
    emit('createOffice');
};
</script>