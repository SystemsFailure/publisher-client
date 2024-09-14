<template>
    <div>
        <Dialog v-model:visible="props.visibleModalUploadeXml" @hide="$emit('closeModal')" maximizable modal
            header="Выгрузка excel таблицы" :style="{ width: '50rem' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" closeOnEscape>
            <ProgressBar v-if="progressUploadinLoader" mode="indeterminate" style="height: 6px"></ProgressBar>

            <template #closeicon>
                <i class="pi pi-times remove_icon" @click="emit('closeModal')"></i>
            </template>

            <div class="mb-5 mt-1">
                <FloatLabel>
                    <InputText id="feed-name-id" v-model="feedNameXml" autofocus placeholder="Название" />
                    <label for="feed-name-id">Введите имя фида</label>
                </FloatLabel>
            </div>

            <div class="card">
                <Toast />
                <FileUpload name="demo[]" :custom-upload="true" @upload="onTemplatedUpload($event)" :multiple="true"
                    :maxFileSize="1000000" @select="onSelectedFiles">
                    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                            <div class="flex gap-2">
                                <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                                <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined
                                    severity="success" :disabled="!files || files.length === 0"></Button>
                                <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger"
                                    :disabled="!files || files.length === 0"></Button>
                            </div>
                        </div>
                    </template>
                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div v-if="files.length > 0">
                            <h5>Pending</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                            height="50" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Pending" severity="warning" />
                                    <Button icon="pi pi-times"
                                        @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined
                                        rounded severity="danger" />
                                </div>
                            </div>
                        </div>

                        <div v-if="uploadedFiles.length > 0">
                            <h5>Completed</h5>
                            <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
                                    class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                    <div>
                                        <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                            height="50" />
                                    </div>
                                    <span class="font-semibold">{{ file.name }}</span>
                                    <div>{{ formatSize(file.size) }}</div>
                                    <Badge value="Completed" class="mt-3" severity="success" />
                                    <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined
                                        rounded severity="danger" />
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex align-items-center justify-content-center flex-column">
                            <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                            <p class="mt-4 mb-0">Перенесите в данную область файл</p>
                        </div>
                    </template>
                </FileUpload>
            </div>

            <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
                <Button type="button" label="Отмена" severity="secondary" @click="$emit('closeModal')"></Button>
                <Button type="button" label="Выгрузить" @click="uploadExcel"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import FileUpload from 'primevue/fileupload';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';

import { ref, onMounted, getCurrentInstance, inject } from 'vue';
import { usePrimeVue } from 'primevue/config';
import { useToast } from "primevue/usetoast";

const props = defineProps(['visibleModalUploadeXml'])
import { generateRandomId } from "@/utils"

const $primevue = usePrimeVue();
const toast = useToast();

const feedNameXml = ref('');
const totalSize = ref(0);
// const progressUploading = ref(0);
const progressUploadinLoader = ref(false);
const files = ref([]);
const filesForUpload = ref([]);
const { emit } = getCurrentInstance();

const http = inject('axios');

function handleEscape() {
    if (event.key === 'Escape') {
        emit('closeModal')
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
})

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
};

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
};

const onSelectedFiles = (event) => {
    files.value = event.files;
    files.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
    handleFileSelect(event)
};

function handleFileSelect(event) {
    const selectedFiles = Array.from(event.files);
    filesForUpload.value.push({
        id: generateRandomId(selectedFiles.length),
        progress: 0,
        file: selectedFiles[0],
    });


    const file = selectedFiles[0]; // Получаем только первый файл
    if (file) {
        filesForUpload.value = [{
            id: generateRandomId(selectedFiles.length),
            progress: 0,
            file: file
        }]; // Обновляем массив files, чтобы он содержал только один файл
    }
}

const uploadEvent = (callback) => {
    callback();
};

const onTemplatedUpload = () => {
    toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
};

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

async function uploadExcel() {
    if(!feedNameXml.value) {
        toast.add({ severity: "error", summary: "Выгрузка xml", detail: 'Укажите имя фида', life: 3000 });
        return;
    }

    progressUploadinLoader.value = true;
    if (!filesForUpload.value[0]) {
        return;
    }

    const file = filesForUpload.value[0];
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('feedName', feedNameXml.value);

    try {
        const response = await http.post(`/upload-excel/${useAuthStore().managerId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const errs = response.data.errors;
        if (errs && Array.isArray(errs) && errs.length > 0) {
            if (!Array.isArray(errs[0])) return
            errs[0].forEach(er => {
                toast.add({ severity: "error", summary: "Валидация excel файла", detail: er, life: 7000 });
            })
        } else {
            toast.add({ severity: "success", summary: "Выгрузка эксель таблицы", detail: "Объекты файла успешно сформированы", life: 7000 });
        }
    } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
    } finally {
        progressUploadinLoader.value = false;
    }
}



</script>