<template>
    <div class="mt-5 mb-5 flex">
        <IconField icon-position="left">
            <InputIcon class="pi pi-user"> </InputIcon>
            <InputText v-model="managerValue" placeholder="введите менеджера" />
        </IconField>
        <Calendar class="ml-2" v-model="selectedDate" placeholder="Выберите дату" />
        <Dropdown v-model="selectedStatus" :options="statuses" optionLabel="label" option-value="value"
            placeholder="Выберите статус" class="w-full md:w-14rem ml-2" />
        <Button class="ml-2" @click="search" severity="info">поиск</Button>
    </div>
    <div class="card p-fluid">
        <DataTable v-model:editingRows="editingRows" :value="items" editMode="row" dataKey="id"
            @row-edit-save="onRowEditSave" :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
                    })
                }
            }">
            <Column field="_id" header="Id" style="width: 20%">
                <template #editor="{ data, field }">
                    <span>{{ field }}</span>
                </template>
            </Column>
            <Column field="manager.login" header="Менеджер" style="width: 20%">
                <template #editor="{ data, field }">
                    <span>{{ field }}</span>
                </template>
            </Column>
            <Column field="status" header="Статус" style="width: 20%">
                <!-- <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value"
                        placeholder="Select a Status">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.value" :severity="getStatusLabel(data, field)" />
                        </template>
                    </Dropdown>
                </template> -->
                <template #body="{ data, field }">
                    <Tag :value="data.status" :severity="getStatusLabel(data, data.status)" />
                </template>
            </Column>
            <Column field="createdAt" header="Дата сохранения" style="width: 20%">
                <template #body="{ data, field }">
                    {{ data.createdAt }}
                </template>
            </Column>

            <Column style="flex: 0 0 4rem" header="Действия">
                <template #body="{ data }">
                    <Button :icon="PrimeIcons.UNDO" :disabled="false" size="small" @click="setupTable(data)" />
                    <Button class="ml-2" :icon="PrimeIcons.EYE" :disabled="false" size="small" @click="showTable(data)"
                        severity="info" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="dialogVisible" header="Flex Scroll" :style="{ width: '75vw' }" maximizable modal
        :contentStyle="{ height: '500px' }">
        <DataTable :value="tableRows" scrollable scrollHeight="flex">
            <Column field="Площадка" header="Площадка" editable :editor="selectEditor">
            </Column>
            <Column field="Id" header="Id"></Column>
            <Column field="Category" header="Категория" editable :editor="selectEditor"></Column>
            <Column field="Description" header="Описание" :editor="largeTextEditor"></Column>
            <Column field="Address" header="Адрес"></Column>
            <Column field="OperationType" header="Тип операции" editable :editor="selectEditor"></Column>
            <Column field="Price" header="Цена"></Column>
            <Column field="RoomType" header="Тип комнат" editable :editor="selectEditor"></Column>
            <Column field="Renovation" header="Ремонт" editable :editor="selectEditor"></Column>
            <Column field="PropertyRights" header="Право собственности" editable :editor="selectEditor"></Column>
            <Column field="LeaseType" header="Тип аренды" editable :editor="selectEditor"></Column>
            <Column field="HouseType" header="Тип дома" editable :editor="selectEditor"></Column>
            <Column field="Floor" header="Этаж"></Column>
            <Column field="Floors" header="Этажность"></Column>
            <Column field="Rooms" header="Количество комнат" editable :editor="selectEditor"></Column>
            <Column field="Square" header="Общая площадь"></Column>
            <Column field="LeaseDeposit" header="Залог" editable :editor="selectEditor"></Column>
            <Column field="LeaseCommissionSize" header="Размер комиссии в %" :editor="numericEditor"></Column>
            <Column field="KitchenSpace" header="Площадь кухни"></Column>
            <Column field="UtilityMeters" header="Оплата по счетчикам" editable :editor="selectEditor"></Column>
            <Column field="OtherUtilities" header="Другие ЖКУ" editable :editor="selectEditor"></Column>
            <Column field="OtherUtilitiesPayment" header="Плата за другие ЖКУ"></Column>
            <Column field="SmokingAllowed" header="Можно курить" editable :editor="selectEditor"></Column>
            <Column field="ChildrenAllowed" header="Можно с детьми" editable :editor="selectEditor"></Column>
            <Column field="PetsAllowed" header="Можно с животными" editable :editor="selectEditor"></Column>
            <Column field="ContactPhone" header="Номер телефона"></Column>
            <Column field="RoomArea" header="Площадь комнаты"></Column>
        </DataTable>
        <template #footer>
            <Button label="Ok" icon="pi pi-check" @click="dialogVisible = false" />
        </template>
    </Dialog>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import { PrimeIcons } from 'primevue/api';

import { ref, onMounted, inject } from 'vue';
import { savedTableService } from '@/services/saved.table.service';
import DateService from '@/services/date.service';

const http = inject('axios');
const items = ref();
const editingRows = ref([]);
const statuses = ref([
    { label: 'Текущий установленный', value: 'Текущая' },
    { label: 'Не установлен', value: 'База' },
]);

const loading = ref(false);

const managerValue = ref(null);
const selectedStatus = ref(null);
const selectedDate = ref(null);

const tableRows = ref();
const dialogVisible = ref(false);
const authStore = useAuthStore();

onMounted(async () => {
    await fetch();
});

const onRowEditSave = (event) => {
    let { newData, index } = event;

    items.value[index] = newData;
};
const getStatusLabel = (data, status) => {
    console.log(status, data, ' ----');
    if (status?.trim() === 'Текущая' && data?.manager?._id === authStore.managerId) {
        console.log(data?.manager?._id, authStore.managerId, data?.manager?._id === authStore.managerId, data);
        return 'success';
    } else {
        if (status === 'База') {
            return 'warning';
        }
    }
};

async function search() {
    await fetch();
}


async function fetch() {
    savedTableService.fetch(http, {
        createdAt: selectedDate.value,
        manager: managerValue.value,
        status: selectedStatus.value,
    }, {
        managerId: authStore.managerId
    }).then(res => {
        const dateService = new DateService();
        items.value = res?.data?.map(el => {
            return Object.assign({}, el, {
                createdAt: dateService.form(el?.createdAt),
            })
        })
    }).finally(() => {
        selectedDate.value = null
        managerValue.value = null
        selectedStatus.value = null
    })
}

async function setupTable(data) {
    const response = await http.put(`/update-status-saved-table/${data._id}`, {
        managerId: authStore.managerId,
    });
    if (response) {
        if (response.data.result) {
            await fetch();
            localStorage.setItem('table:rows', JSON.stringify(
                JSON.parse(data?.data)
            ));
        }
    }
}

async function showTable(data) {
    tableRows.value = JSON.parse(data?.data);
    dialogVisible.value = true;
}

</script>
