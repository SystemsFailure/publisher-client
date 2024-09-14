<template>
    <Toast />

    <!-- Создание офиса -->
    <Dialog v-if="visibleOfficeCreatingDialog" v-model:visible="visibleOfficeCreatingDialog" maximizable modal
        header="Создание офиса" :style="{ width: '50rem', padding: '15px' }">

        <Card>
            <template #title>Форма заполнения данных офиса</template>
            <template #content>
                <div class="flex flex-column gap-2">
                    <label for="office-name">Название офиса</label>
                    <InputText id="office-name" v-model.trim="newOfficeData.name" placeholder="Название" />
                    <small id="office-name-help">Введите название</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_code">Код офиса</label>
                    <InputText id="office_code" v-model.trim="newOfficeData.code" />
                    <small id="office_code-help">Введите код</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_address">Адрес офиса</label>
                    <InputText id="office_address" v-model.trim="newOfficeData.address" />
                    <small id="office_address-help">Введите адрес офиса</small>
                </div>
                <div class="flex flex-column gap-2 mt-3">
                    <label for="office_region">Регион</label>
                    <Dropdown v-model="newOfficeData.region" :options="regions" optionLabel="name"
                        placeholder="Выберите регион" class="w-full md:w-200rem" variant="outlined" />
                </div>
            </template>
        </Card>
        <div class="flex justify-content-end gap-2 mt-4">
            <Button type="button" label="Отмена" severity="secondary"
                @click="() => visibleOfficeCreatingDialog = false" />
            <Button type="button" label="Создать" @click="createOffice" severity="success" />
        </div>
    </Dialog>

    <!-- Настройки платформ -->
    <Dialog v-if="visibleSetupKeysDialog" v-model:visible="visibleSetupKeysDialog" maximizable modal
        header="Настройки офисов" :style="{ width: '50rem', padding: '15px' }">
        <div>
            <Card>
                <template #title>Учетные данные Авито</template>
                <template #content>
                    <div class="flex flex-column gap-2">
                        <label for="avito_client_key">Авито client id</label>
                        <InputText id="avito_client_key" v-model.trim="avitoCredentials.clientId" />
                        <small id="avito_client_key-help">Введите client id вашего аккаунта Авито</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="avito_secret_key">Авито секретный ключ</label>
                        <InputText id="avito_secret_key" v-model.trim="avitoCredentials.secretKey" />
                        <small id="avito_secret_key-help">Введите секретный ключ вашего аккаунта Авито</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="avito_mail">Авито адрес почты</label>
                        <InputText id="avito_mail" v-model.trim="avitoCredentials.mailAddress" />
                        <small id="avito_mail-help">Введите адрес почты для получения уведомлений</small>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mt-1">
                        <div class="ml-auto gap-3">
                            <Button label="Отмена" severity="secondary" outlined class="mr-3" />
                            <Button label="Установить" @click="setupPlatformKeys('avito')" />
                        </div>
                    </div>
                </template>
            </Card>

            <Card class="mt-5">
                <template #title>Учетные данные Циана</template>
                <template #content>
                    <div class="flex flex-column gap-2">
                        <label for="cian_client_key">Циан клиент id</label>
                        <InputText id="cian_client_key" v-model.trim="cianCredentials.clientId" />
                        <small id="cian_client_key-help">Введите client id вашего аккаунта Циана</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="cian_secret_key">Циан адрес эл. почты</label>
                        <InputText id="cian_secret_key" v-model.trim="cianCredentials.mailAddress" />
                        <small id="cian_secret_key-help">Введите вашу рабочую эл. почту</small>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mt-1">
                        <div class="ml-auto gap-3">
                            <Button label="Отмена" severity="secondary" outlined class="mr-3" />
                            <Button label="Установить" @click="setupPlatformKeys('cian')" />
                        </div>
                    </div>
                </template>
            </Card>

            <Card class="mt-5">
                <template #title>Учетные данные Юлы</template>
                <template #content>
                    <div class="flex flex-column gap-2">
                        <label for="youla_client_key">Юла token api</label>
                        <InputText id="youla_client_key" v-model.trim="youlaCredentials.tokenApi" />
                        <small id="youla_client_key-help">Введите ваш token api Юлы</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="youla_user_id">Id пользователя Юлы</label>
                        <InputText id="youla_user_id" v-model.trim="youlaCredentials.userId" />
                        <small id="youla_user_id-help">Введите ваш пользовательский id</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="youla_user_contact_id">Contact Id пользователя</label>
                        <InputText id="youla_user_contact_id" v-model.trim="youlaCredentials.userContactId" />
                        <small id="youla_user_contact_id-help">Введите ваш пользовательский contact id</small>
                    </div>
                    <div class="flex flex-column gap-2 mt-3">
                        <label for="youla_mail">Юла адрес эл. почты</label>
                        <InputText id="youla_mail" v-model.trim="youlaCredentials.mailAddress" />
                        <small id="youla_mail-help">Введите вашу рабочую эл. почту</small>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mt-1">
                        <div class="ml-auto gap-3">
                            <Button label="Отмена" severity="secondary" outlined class="mr-3" />
                            <Button label="Установить" @click="setupPlatformKeys('youla')" />
                        </div>
                    </div>
                </template>
            </Card>

            <Card class="mt-5">
                <template #title>Учетные данные Яндекс карт</template>
                <template #content>
                    <div class="flex flex-column gap-2">
                        <label for="yandex-map_client_key">Яндекс карты token api</label>
                        <InputText id="yandex-map_client_key" v-model.trim="yandexMapsTokenApiValue" />
                        <small id="yandex-map_client_key-help">Введите ваш token api Яндекс карт</small>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mt-1">
                        <div class="ml-auto gap-3">
                            <Button label="Отмена" severity="secondary" outlined class="mr-3" />
                            <Button label="Установить" />
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="mt-3">
            <h5 class="font-bold text-lg">Сотрудники привязанные к данному офису</h5>
        </div>
        <Card>
            <template #title>Сотрудники</template>
            <template #content>
                <div v-for="manager in managers" :key="manager._id"
                    class="p-3 mt-1 flex items-center border border-gray-500 rounded">
                    <div v-if="!hasManagers"> Менеджеров нет </div>
                    <div v-else class="flex items-center">
                        <div>ID: {{ manager._id }}</div>
                        <div class="ml-3">Имя: {{ manager.login }}</div>
                    </div>
                </div>
            </template>
        </Card>
    </Dialog>

    <!-- Основной контент -->
    <div class="mb-5 mt-3">
        <Button label="Создать офис" :icon="PrimeIcons.PLUS" severity="success" outlined
            @click="openCreatingOfficeDialog" />
    </div>
    <div class="card">
        <DataTable tableStyle="min-width: 30rem" v-model:selection="selectedOffice" :value="offices"
            selectionMode="single" dataKey="_id" :metaKeySelection="false" @rowSelect="onRowSelect"
            @rowUnselect="onRowUnselect" paginator :rows="perPages" :rowsPerPageOptions="rowsPerPaginator">

            <Column field="_id" header="ID" style="min-width: 100px"></Column>
            <Column field="code" header="Код" style="min-width: 200px"></Column>
            <Column field="name" header="Имя" style="min-width: 200px"></Column>
            <Column field="region" header="Регион" style="min-width: 200px"></Column>
            <Column field="address" header="Адрес" style="min-width: 200px"></Column>
            <Column field="createdAt" header="Дата создания" style="min-width: 200px"></Column>
        </DataTable>
    </div>
</template>



<script setup>
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import { PrimeIcons } from 'primevue/api';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted, inject, reactive } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

// Подключение тостов
const toast = useToast();

// Инъекция HTTP клиента
const http = inject('axios');

// Ссылки и состояния
const offices = ref([]);
const selectedOffice = ref();
const rowsPerPaginator = ref([5, 10, 20, 50]);
const perPages = 10;
const currentOfficeId = ref(null);
const visibleSetupKeysDialog = ref(false);
const creatingOfficeLoading = ref(false);
const visibleOfficeCreatingDialog = ref(false);
const managers = ref([]);
const hasManagers = ref(false);

const avitoCredentials = reactive({
    clientId: '',
    secretKey: '',
    mailAddress: '',
});

const cianCredentials = reactive({
    clientId: '',
    mailAddress: '',
});

const youlaCredentials = reactive({
    tokenApi: '',
    mailAddress: '',
    userId: '',
    userContactId: '',
});

const newOfficeData = ref({
    name: '',
    address: '',
    code: '',
    region: '',
});

const regions = ref([]);

// Жизненный цикл компонента
onMounted(async () => {
    await Promise.all([
        fetchAllOffices(),
        fetchOfficeCredentials(),
        fetchRegions(),
    ]);
});

// Общие функции для получения данных
async function fetchData(url, successCallback, errorCallback) {
    try {
        const { data } = await http.get(url);
        if (data.result) {
            successCallback(data);
        } else {
            errorCallback(data.message);
        }
    } catch (error) {
        console.error(`Ошибка при запросе данных с ${url}:`, error);
        toast.add({ severity: "error", summary: "Ошибка", detail: 'Ошибка сети', life: 3000 });
    }
}

// Получение всех офисов
async function fetchAllOffices() {
    await fetchData(
        '/get-all-offices',
        data => offices.value = data.offices_,
        message => console.log('Ошибка получения офисов:', message)
    );
}

// Получение всех регионов
async function fetchRegions() {
    await fetchData(
        '/get-all-regions',
        data => regions.value = data.regions,
        message => console.log('Ошибка получения регионов:', message)
    );
}

// Получение учётных данных для офиса
async function fetchOfficeCredentials() {
    if (!currentOfficeId.value) return;

    await fetchData(
        `/get-office-credentials/${currentOfficeId.value}`,
        data => {
            const { officeCredential } = data;
            avitoCredentials.clientId = getCredential(officeCredential, 'avito', 'clientId');
            avitoCredentials.secretKey = getCredential(officeCredential, 'avito', 'secretKey');
            avitoCredentials.mailAddress = getCredential(officeCredential, 'avito', 'mailAddress');

            cianCredentials.clientId = getCredential(officeCredential, 'cian', 'clientId');
            cianCredentials.mailAddress = getCredential(officeCredential, 'cian', 'mailAddress');

            youlaCredentials.tokenApi = getCredential(officeCredential, 'youla', 'tokenApi');
            youlaCredentials.mailAddress = getCredential(officeCredential, 'youla', 'mailAddress');
            youlaCredentials.userId = getCredential(officeCredential, 'youla', 'userId');
            youlaCredentials.userContactId = getCredential(officeCredential, 'youla', 'userContactId');
        },
        message => toast.add({ severity: "error", summary: "Ошибка", detail: message, life: 3000 })
    );
}

// Функция для получения данных учётных записей по платформе
function getCredential(credentials, platform, key) {
    const cred = credentials.find(el => el.platform === platform);
    return cred ? JSON.parse(cred.credentials)[key] : '';
}

// Настройка ключей платформ
async function setupPlatformKeys(platform) {
    if (!currentOfficeId.value) return;

    const { data } = await http.post(`/setup-platform-keys/${platform}/${currentOfficeId.value}`, {
        avito: avitoCredentials,
        cian: cianCredentials,
        youla: youlaCredentials,
    });

    if (data.result) {
        toast.add({ severity: "success", summary: "Установка ключей", detail: data.message, life: 3000 });
    } else {
        toast.add({ severity: "error", summary: "Ошибка", detail: data.message, life: 3000 });
    }
}

// Создание нового офиса
async function createOffice() {
    if (!newOfficeData.value) return;

    creatingOfficeLoading.value = true;

    try {
        const { data } = await http.post('/create-office', { data: newOfficeData.value });
        toast.add({ severity: data.result ? "success" : "error", summary: data.result ? "Успешно" : "Ошибка", detail: data.message, life: 3000 });
        if (data.result) {
            await fetchAllOffices();
        }
    } catch (error) {
        console.error("Ошибка создания офиса:", error);
    } finally {
        creatingOfficeLoading.value = false;
        visibleOfficeCreatingDialog.value = false;
    }
}

// Получение менеджеров офиса
async function fetchManagers(officeId) {
    await fetchData(
        `/get-all-managers-by-office/${officeId}`,
        data => {
            managers.value = data.managers;
            hasManagers.value = data.managers.length > 0;
        },
        message => {
            hasManagers.value = false;
            console.log('Ошибка получения менеджеров:', message);
        }
    );
}

// Открытие диалога создания нового офиса
function openCreatingOfficeDialog() {
    visibleOfficeCreatingDialog.value = true;
}

// Обработчики событий таблицы
const onRowSelect = async (event) => {
    visibleSetupKeysDialog.value = true;
    currentOfficeId.value = event.data._id;
    await fetchOfficeCredentials();
    await fetchManagers(currentOfficeId.value);
    console.log(event.data.name);
};

const onRowUnselect = (event) => {
    console.log(event.data.name);
};

</script>
