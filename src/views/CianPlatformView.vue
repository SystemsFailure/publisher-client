<template>
    <UploadList title="Текущие выгрузки Циана" :fetchData="fetchData" :startUpload="startUpload"
        :changeStatus="changeStatus" :handleError="handleError" :platform="'cian'" @uploadSuccess="onUploadSuccess"
        @uploadFailure="onUploadFailure" />
</template>

<script setup>

import UploadList from '@/components/UploadPlatform.vue';
import { fetchData, startUpload, handleError, changeStatus } from '@/composables/uploadService';

const onUploadSuccess = (data) => {
};

const onUploadFailure = (error) => {
    console.error('Upload failed', error);
};
</script>