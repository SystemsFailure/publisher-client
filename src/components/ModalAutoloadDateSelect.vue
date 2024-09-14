<template>
    <div>
        <Toast />

        <Dialog v-model:visible="props.visible" modal header="Установить время автовыгрузки"
            :style="{ width: '50rem', padding: '15px' }">

            <div>
                <div class="mb-5" style="display: flex; align-items: center;">

                    <FloatLabel style="margin-bottom: 10px;">
                        <InputText id="id" v-model="currentURL" />
                        <label for="id">Ссылка на xml</label>
                    </FloatLabel>

                </div>
            </div>

            <template #closeicon>
                <i class="pi pi-times remove_icon" @click="emit('closeModal')"></i>
            </template>
            <div class="mt-5 mb-3">Временные метки</div>
            <div>
                <div class="mb-5" style="display: flex; align-items: center;">
                    <div class="p-multiselect p-component">
                        <div class="p-multiselect-label">{{ labelText }}</div>
                        <div class="p-multiselect-items">
                            <div v-for="(day, index) in daysOfWeek" :key="index" class="p-multiselect-item"
                                @click="toggleSelection(day)"
                                :class="['p-multiselect-item-icon', { 'p-multiselect-item-selected': isSelected(day) }]">
                                <div>
                                    {{ day }}</div>
                            </div>
                        </div>
                    </div>


                    <div class="ml-2">
                        <Calendar id="calendar-timeonly" v-model="time" timeOnly placeholder="Выберите время"
                            class="" />
                    </div>

                </div>
                <div class="flex align-items-center mb-4">
                    <Checkbox v-model="allDays" inputId="allDaysId" name="allDays" :value="true" />
                    <label for="ingredient2" class="ml-2"> Все дни недели </label>
                </div>
            </div>

            <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
                <Button type="button" label="Отмена" severity="secondary" @click="$emit('closeModal')"></Button>
                <Button type="button" label="Установить" @click="setupTiming" severity="success"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, watch, inject, onMounted } from 'vue';

import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { useAuthStore } from '@/stores/auth';

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
})

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const selectedDays = ref([]);
const time = ref(null);
const dates = ref([])
const allDays = ref();
const currentURL = ref('');

const http = inject('axios');
const emit = defineEmits(['closeModal']);
const toast = useToast();

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
});

watch(allDays, async (new_, _) => {
    if (new_[0] === true) {
        addDateRange(true)
        selectedDays.value = daysOfWeek
    } else {
        dates.value = [];
        selectedDays.value = [];
    }
})


async function setupTiming() {
    if (!convertTimeToHours(time.value) || convertDaysOfWeekToNumbers(dates.value).length === 0) {
        console.error('Не все необходимые данные заполнены.', currentURL.value, time.value, dates.value);
        console.error(convertTimeToHours(time.value), convertDaysOfWeekToNumbers(dates.value))
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не все данные заполнены.',
            life: 3000
        });
        return;
    }
    console.error(convertTimeToHours(time.value), convertDaysOfWeekToNumbers(dates.value), selectedDays.value, convertDaysOfWeekToNumbers(selectedDays.value), '\n 21121212')
    try {
        const response = await http.post('/setup-autoload-time', {
            profileConfig: {
                url: currentURL.value,
                time_slots: convertTimeToHours(time.value),
                weekdays: convertDaysOfWeekToNumbers(selectedDays.value),
                officeId: useAuthStore()?.managerData?.officeId,
            }
        });

        if (response.data.result) {
            successToast();
        } else {
            badToast();
        }
    } catch (error) {
        console.error('Произошла ошибка при сохранении настроек:', error);
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Произошла ошибка при сохранении настроек.',
            life: 3000
        });
    }
}

function successToast() {
    toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Настройки успешно сохранены.',
        life: 3000
    });
}

function badToast() {
    console.error('Не удалось сохранить настройки:', response.data.message);
    toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось сохранить настройки.',
        life: 3000
    });
}

function addDateRange(all) {
    if (all) {
        daysOfWeek.forEach(el => {
            dates.value.push({ value: el });
        })
        return
    }
    selectedDays.value.forEach(el => {
        const exists = dates.value.find(date => date.value === el);
        if (!exists) {
            dates.value.push({ value: el });
        }
    });
}

const toggleSelection = (day) => {
    if (isSelected(day)) {
        selectedDays.value = selectedDays.value.filter(d => d !== day);
    } else {
        selectedDays.value = [...selectedDays.value, day];
    }
};

const isSelected = (day) => {
    return selectedDays.value.includes(day);
};

function handleEscape() {
    if (event.key === 'Escape') {
        emit('closeModal')
    }
}

function convertDaysOfWeekToNumbers() {
    const dayToNumberMap = {};
    const convertedArray = selectedDays.value.map((day, index) => {
        const number = index + 1;
        dayToNumberMap[day] = number;
        return number;
    });

    return convertedArray;
}

function convertTimeToHours(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours();
    return hours;
}

</script>

<style scoped>
.p-multiselect {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 5px
}

.p-multiselect-items {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
}

.p-multiselect-item {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid #c8c8c8;
    border-radius: 10px;
    margin-left: 5px;
}

.p-multiselect-item:hover {
    background-color: #f0f0f0;
}

.p-multiselect-item-icon {
    font-size: 14px;
}

.p-multiselect-item-selected {
    background-color: #1ec0e9 !important;
    color: #ffffff;
}
</style>
