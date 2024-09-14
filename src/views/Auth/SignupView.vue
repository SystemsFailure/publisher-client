<template>
    <Toast />
    <div style="position: absolute; top: 0; width: 99.5%; height: auto; display: flex; justify-content: end;">
        <div class="card flex justify-content-center" style="z-index: 1;">
            <SelectButton v-model="selectedAction" :options="actions" aria-labelledby="basic" />
        </div>
    </div>
    <div class="full-container">
        <div class="card mb-5">
            <Fieldset legend="Регистрация" style="max-width: 400px;">
                <p class="center-text" style="text-align: center;">
                    Создайте учетную запись для доступа к различным функциям и персонализированному контенту
                </p>
            </Fieldset>
        </div>

        <div class="card block justify-center">
            <div class="card flex" style="flex-direction: column">
                <InputText id="login" v-model="loginValue" :invalid="loginValue === null || loginValue === ''"
                    placeholder="Введите логин" />
                <InputText id="secretToken" v-model="secretValue" :invalid="secretValue === null || secretValue === ''"
                    placeholder="Введите секретный ключ" class="mt-3" />

                <MultiSelect v-model="selectOffice" :options="offices" optionLabel="name" placeholder="Выберите офисы"
                    :maxSelectedLabels="3" class="w-full md:w-20rem mt-3" :loading="loading" />

                <!-- <Dropdown class="mt-3" v-model="selectOffice" :options="offices" optionLabel="name" option-value="_id"
                    placeholder="Выберите офис" /> -->
            </div>

            <div class="mt-3">
                <InputText id="numberPhone" v-model="numberPhone" :invalid="numberPhone === null || secretValue === ''"
                    placeholder="Введите номер телефона" class="mt-3" />
            </div>
        </div>

        <div class="card block justify-center mt-3 mb-2">
            <Password v-model="passwordValue" :feedback="false" placeholder="Введите пароль" />
        </div>

        <div class="card flex justify-center mt-4">
            <Button label="Зарегестрироваться" severity="success" :loading="loading" outlined @click="confirmSignUp()"
                style="margin-top: 5px;" />
        </div>
    </div>
</template>
<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';
import SelectButton from 'primevue/selectbutton';
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';


import { ref, watch, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { statuses20x } from '@/utils/statuses.200.ts';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const loginValue = ref('');
const passwordValue = ref('');
const secretValue = ref('');
const loading = ref(false);

const selectedAction = ref('Регистрация');
const actions = ref(['Регистрация', 'Аутентификация']);

const offices = ref([
    { name: 'Буденого 129', _id: '669f7a0552fd585a1e4d5b8f' },
]);

const selectOffice = ref();

watch(selectedAction, (newValue) => {
    if (newValue === 'Регистрация') {
        router.push({ name: 'signup' });
    } else if (newValue === 'Аутентификация') {
        router.push({ name: 'login' });
    }
});

const http = inject('axios')

onMounted(async () => {
    await fetchAllOffiecs();
})

// Получение всех офисов
async function fetchAllOffiecs() {
    const { data: { offices_, result, error } } = await http.get(`/get-all-offices`);
    if (!result) {
        console.log(error);
        return;
    }
    offices.value = offices_;
}

function showError(message, summary) {
    toast.add({ severity: 'error', summary: summary, detail: message, life: 3000 });
    return false;
}

function validateField(value, minLength, errorMessage, summary) {
    if (!value) {
        return showError(`${errorMessage} обязателен`, `Валидация ${summary}`);
    } else if (value.length < minLength) {
        return showError(`${errorMessage} должен быть не менее ${minLength} символов`, `Валидация ${summary}`);
    }
    return true;
}

function validateFields() {
    let isValid = true;

    isValid &= validateField(loginValue.value, 3, 'Логин', 'логина');
    isValid &= validateField(passwordValue.value, 6, 'Пароль', 'пароля');
    isValid &= validateField(secretValue.value, 1, 'Секретный токен', 'секретного ключа');

    return !!isValid;
}

async function confirmSignUp() {
    if (!validateFields()) {
        return;
    }

    loading.value = true;
    console.log('sign up', selectOffice.value);

    const signupData = {
        login: loginValue.value,
        password: passwordValue.value,
        secret_token: secretValue.value,
        officeIds: selectOffice.value,
    };

    try {
        const response = await http.post('/signup', signupData);
        if (statuses20x().includes(response.status)) {
            if (!response.data?.manager) return;
            authStore.updateLogin(true);
            authStore.updateManagerId(response.data?.manager._id);
            authStore.updateManagerData(JSON.stringify(response.data?.manager));

            localStorage.setItem('token', response.data?.token);
            router.push({ name: 'table' });
        }
        console.debug('Sign up response:', response.data);
    } catch (error) {
        console.error('Error during sign up:', error.response ? error.response.data : error.message);
    } finally {
        resetValues();
    }
}

function resetValues() {
    loading.value = false;
    loginValue.value = '';
    passwordValue.value = '';
    secretValue.value = '';
}
</script>

<style scoped>
.full-container {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    position: relative;
    width: 98vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>