<template>

    <ConfirmDialog group="upload">
        <template #message="slotProps">
            <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border p-3 mb-3 pb-0">
                <span>{{ slotProps.message.message }}</span>
                <div class="mb-1 mt-3">
                    <Calendar v-model="selectedDate" class="w-full md:w-20rem" placeholder="Выберите дату выгрузки"
                        showTime hourFormat="24" showIcon iconDisplay="input" />
                </div>

                <div class="mb-3 mt-1">
                    <Dropdown v-model="selectedOffice" :options="offices" optionLabel="name"
                        :placeholder="'Выберите Офис'" class="w-full md:w-20rem" variant="outlined" />
                </div>
            </div>
        </template>
    </ConfirmDialog>

    <div>
        <Toast />
        <div class="mt-5">{{ title }}</div>
        <div class="surface-ground px-4 py-5 md:px-6 lg:px-8 mt-5">
            <div class="grid">
                <div class="col-12 md:col-6 lg:col-3" v-for="(item, index) in notificationsStore.autoloads"
                    :key="item._id">
                    <div class="surface-card shadow-2 p-3 border-round">
                        <div class="flex justify-content-between mb-2">
                            <div>
                                <span class="block text-500 font-medium mb-2" style="font-size: 12px;">id: {{ item._id
                                    }}</span>
                                <span class="mt-3 mb-2" style="font-size: 16px;"> Название: {{ item?.feedName ||
            'Безназвания' }} </span>
                                <div class="text-900 font-medium text mt-2" v-tooltip="item.storagePath"
                                    style="cursor: pointer; font-size: 14px;">
                                    {{ item.storagePath.slice(0, 40) + '...' }}
                                    <i class="pi pi-copy text-white-500 text-ml" id="copyIconUrl"
                                        @click="copyToClipboard(item.storagePath)"></i>
                                </div>
                            </div>
                            <div style="width: 10%">
                                <StatusBadge :status="item.status" v-tooltip="`Статус: ${item.status}`" />
                            </div>
                        </div>
                        <span class="text-green-500" style="font-size: 15px;">{{ item.countAds }} </span>
                        <span v-if="item.countAds > 4" class="text-500"> объявлений</span>
                        <span v-else class="text-500"> объявления</span>
                        <div class="mt-3" style="display: flex; align-items: center;">
                            <Button :disabled="item.status === 'Опубликована' || item.status === 'Отложена'"
                                type="button" icon="pi pi-cloud" :loading="loading[index]"
                                @click="onUploadAutoloadConfirm($event, index)" v-tooltip="'Создать выгрузку'"
                                size="small" />

                            <Button v-if="props.platform === 'youla'" severity="danger" type="button" icon="pi pi-trash"
                                :loading="loading[index]" @click="confirmDelete($event, index)" class="ml-2"
                                v-tooltip="'Удалить автовыгрузку'" size="small" />

                            <Button v-if="props.platform === 'youla'" severity="contrast" type="button"
                                icon="pi pi-power-off" :loading="loading[index]" @click="onStopPublish(index)"
                                class="ml-2" v-tooltip="'Остановить публикацию'" size="small" />

                            <div v-if="props.platform !== 'youla'"
                                style="margin-left: auto; font-size: 12px; color: #666;">
                                {{ item.createdAt }}
                            </div>
                        </div>
                        <div v-if="props.platform === 'youla'" class="mt-3" style="display: flex; align-items: center;">
                            <div style="margin-left: auto; font-size: 12px; color: #666;"> {{ item.createdAt }} </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useAuthStore } from '@/stores/auth';
import StatusBadge from '@/components/StatusBadge.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Calendar from 'primevue/calendar';
import { useNotificationsStore } from '../stores/notification';
import Dropdown from 'primevue/dropdown';

const notificationsStore = useNotificationsStore();
const confirm = useConfirm();
const toast = useToast();
const http = inject('axios');

const selectedOffice = ref(null);
const offices = ref([]);
const selectedDate = ref();
const popupVisible = ref(false);
const loading = ref([]);

const props = defineProps({
    title: { type: String, default: 'Список выгрузок' },
    fetchData: { type: Function, required: true },
    startUpload: { type: Function, required: true },
    changeStatus: { type: Function, required: true },
    handleError: { type: Function, required: true },
    platform: { type: String, required: true }
});

const emit = defineEmits(['uploadSuccess', 'uploadFailure']);

const initializeLoadingState = () => {
    loading.value = notificationsStore.autoloads.map(() => false);
};

const fetchOffices = async () => {
    try {
        const response = await http.get(`/get-all-offices-by-manager/${useAuthStore().managerId}`);
        if (response.data.result && response.data.offices) {
            offices.value = response.data.offices;
        }
    } catch (error) {
        console.error('Ошибка при получении офисов:', error);
    }
};

const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 7000
    });
};

const setLoadingState = (index, state) => {
    loading.value[index] = state;
};

const onUploadAutoloadConfirm = (event, index) => {
    confirm.require({
        target: event.currentTarget,
        group: 'upload',
        message: 'Укажите дату и время публикации',
        header: 'Подтверждение',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Выгрузить',
        rejectLabel: 'Отмена',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm p-button-success',
        accept: () => onUpload(index),
        reject: () => popupVisible.value = true,
        onShow: () => popupVisible.value = true,
        onHide: () => popupVisible.value = false
    });
};

const onUpload = async (index) => {
    if (!selectedOffice.value) {
        showToast('error', 'Валидация', 'Не выбран офис');
        return;
    }

    setLoadingState(index, true);

    const item = notificationsStore.autoloads[index];
    try {
        const { message, result } = await props.startUpload(
            http,
            `/upload-start-${props.platform}/${item._id}/${selectedOffice.value?._id}`,
            { date: selectedDate.value }
        );
        if (!result) {
            showToast('error', 'Выгрузка', message);
            return;
        }
        await notificationsStore.fetch(props.platform, http);
        showToast('success', 'Выгрузка', message);
        emit('uploadSuccess', { data: { message, result } });
    } catch (error) {
        console.error('Ошибка при выгрузке:', error);
    } finally {
        setLoadingState(index, false);
    }
};

const onStopPublish = async (index) => {
    setLoadingState(index, true);
    const item = notificationsStore.autoloads[index];
    try {
        const { data: { result, message } } = await http.delete(`/delete-publication-autoload-youla/${useAuthStore()?.managerData?.officeId}/${item.subId}`);
        if (result) showToast('success', 'Публикация', message);
    } catch (error) {
        console.error('Ошибка при остановке публикации:', error);
    } finally {
        setLoadingState(index, false);
    }
};

const confirmDelete = (event, index) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Вы уверены, что хотите удалить эту выгрузку?',
        header: 'Подтверждение',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Удалить',
        rejectLabel: 'Отмена',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-sm p-button-danger',
        accept: () => onDelete(index)
    });
};

const onDelete = async (index) => {
    setLoadingState(index, true);
    const item = notificationsStore.autoloads[index];
    try {
        const { data: { result, message } } = await http.delete(`/delete-autoload-youla/${item._id}/${useAuthStore()?.managerData?.officeId}/${item.subId}`);
        showToast(result ? 'success' : 'danger', result ? 'Удаление автовыгрузки' : 'Автовыгрузка', message);
        if (result) await notificationsStore.fetch(props.platform, http);
    } catch (error) {
        console.error('Ошибка при удалении:', error);
    } finally {
        setLoadingState(index, false);
    }
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('success', 'Копирование', 'Ссылка успешно скопирована');
    } catch (error) {
        console.error('Не удалось скопировать текст:', error);
    }
};

onMounted(async () => {
    await Promise.all([
        fetchOffices(),
        notificationsStore.fetch(props.platform, http),
    ]);
    notificationsStore.setHttpClient(http);
});

watch(notificationsStore.autoloads, initializeLoadingState);
</script>


<style scoped>
.dates-badges {
    border-radius: 5px;
    margin-right: 10px;
    padding: 5px;
    font-size: 12px;
    width: 100px;
    height: 40px;
    border: 1px solid #c5c5c5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>