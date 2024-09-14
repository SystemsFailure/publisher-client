<template>
    <Toast />

    <div>
        <div class="mt-5 mb-5 flex">
            <InputText v-model="adId" placeholder="Введите ID объявления" />
            <Dropdown v-model="selectedPlatform" :options="platforms" optionLabel="label" option-value="value"
                placeholder="Выберите платформу" class="w-full md:w-14rem ml-2" />
            <Button class="ml-2" @click="reset" severity="danger">Сбросить</Button>
            <Button class="ml-2" @click="search" severity="info">поиск</Button>
        </div>
    </div>

    <div class="mt-3 mb-5">
        <span style="font-size: 15px">
            Файлы выбраны из: {{ !selectedPlatform ? "Все" : selectedPlatform.toUpperCase() }}
        </span>
    </div>

    <div class="grid grid-cols-4 gap-4 p-8">
        <Card v-for="(image, index) in files" :key="index" style="width: 20rem; overflow: hidden">
            <template #header>
                <Image :src="image.url" alt="Image" width="350" height="200" preview />
            </template>
            <template #title>
                <span style="font-size: 15px">{{ image._doc.platform }}</span>
            </template>
            <template #subtitle>
                <div class="flex" style="flex-direction: column; justify-content: center;">
                    <span style="font-size: 12px">Имя: {{ sliceText(image._doc.name) }}</span>
                    <span style="font-size: 12px" class="mt-2">ID объявления: {{ image._doc.adId }}</span>
                    <span style="font-size: 12px" class="mt-2">Размер файла: {{ bytesToMegabytes(image._doc.size) }}
                        Мб</span>
                    <span style="font-size: 12px" class="mt-2">Дата загрузки: {{ image._doc.createdAt }}</span>
                </div>
            </template>
            <template #content>
                <p class="m-0"></p>
            </template>
            <template #footer>
                <div class="flex gap-3 mt-1">
                    <Button :icon="PrimeIcons.COPY" severity="secondary" outlined class="w-full" size="small"
                        @click="copy(image.url)" />
                    <Button class="w-full" :icon="PrimeIcons.TRASH" severity="danger"
                        @click="deleteImage(image._doc._id)" />
                </div>
            </template>
        </Card>
    </div>

</template>
<script setup>
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Image from 'primevue/image';
import { PrimeIcons } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

import { inject, ref, onMounted } from 'vue';

const files = ref([]);
const http = inject('axios');
const toast = useToast();

const adId = ref('');
const selectedPlatform = ref('');
const platforms = ref([
    { label: 'Авито', value: 'avito' },
    { label: 'Циан', value: 'cian' },
    { label: 'Юла', value: 'youla' },
    { label: 'Домклик', value: 'domclick' },
    { label: 'Яндекс', value: 'yandex' },
]);

onMounted(async () => {
    await fetch();
})

async function fetch() {
    const response = await http.post('/get-all-ads-files', {
        filter: {
            adId: adId.value,
            platform: selectedPlatform.value,
        }
    });

    if (response.data.result) {
        files.value = response.data.files;
    } else {
        console.error(response, '\n Ошибка получения файлов')
    }
}

async function reset() {
    if (adId.value || selectedPlatform.value) {
        adId.value = '';
        selectedPlatform.value = '';
        await fetch();
    }
}

async function search() {
    await fetch();
}

async function copy(text) {
    await navigator.clipboard.writeText(text);
    toast.add({
        severity: 'success',
        summary: 'Копирование',
        detail: 'Ссылка успешно скопирована',
        life: 3000
    });
}

async function deleteImage(id) {
    const response = await http.delete(`/delete-ad-file/${id}`);
    if (response.data.success) {
        await fetch();
        toast.add({ severity: 'success', summary: 'Успешное удаление', detail: response.data.message, life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Не успешное удаление', detail: response.data.message, life: 3000 });
    }
}

/**
 * Локальные функции
 */

function bytesToMegabytes(bytes) {
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(2); // Округляем до двух знаков после запятой
}

function sliceText(text) {
    return text.slice(0, 100);
}

</script>