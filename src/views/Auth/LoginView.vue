<template>
    <Toast />
    <div style="position: absolute; top: 0; width: 99.5%; height: auto; display: flex; justify-content: end;">
        <div class="card flex justify-content-center" style="z-index: 1;">
            <SelectButton v-model="selectedAction" :options="actions" aria-labelledby="basic" />
        </div>
    </div>
    <div class="full-container">
        <div class="card mb-5">
            <Fieldset legend="Аутентификация" style="max-width: 400px;">
                <p class="center-text" style="text-align: center;">
                    Пройдите аутентификацию для входа в систему. Введите свой логин и пароль
                </p>
            </Fieldset>
        </div>

        <div class="card block justify-center">
            <div class="">
                <InputText id="login" v-model="loginValue" :invalid="loginValue === null || loginValue === ''"
                    placeholder="Введите логин" />
            </div>
        </div>

        <div class="card block justify-center mt-5 mb-5">
            <Password v-model="passwordValue" :feedback="false" placeholder="Введите пароль" />
        </div>

        <div class="card flex justify-center">
            <Button label="Вход" severity="success" :loading="loading" outlined @click="login()"
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
import { ref, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const router = useRouter();
const passwordValue = ref('');
const loginValue = ref('');
const loading = ref(false);
const secretValue = ref('');
const authStore = useAuthStore();
const http = inject('axios')

const selectedAction = ref('Аутентификация');
const actions = ref(['Регистрация', 'Аутентификация']);

watch(selectedAction, (newValue) => {
    if (newValue === 'Регистрация') {
        router.push({ name: 'signup' });
    } else if (newValue === 'Аутентификация') {
        router.push({ name: 'login' });
    }
});

async function login() {
    if (!loginValue.value || !passwordValue.value) {
        alert('Login и пароль обязательны');
        return;
    }

    loading.value = true;

    const loginData = {
        login: loginValue.value,
        password: passwordValue.value,
    };

    try {
        const response = await http.post('/login', loginData);

        if (!response.data.result) {
            toast.add({
                severity: 'error',
                summary: 'Ошибка входа',
                detail: response.data.message,
                life: 3000
            });
        }

        if (response.status === 200 && response.data) {
            const { token, manager } = response.data;

            if (!manager) return;

            // Сохраняем токен в локальном хранилище
            localStorage.setItem('token', token);

            // Обновляем состояние аутентификации в store
            authStore.updateLogin(true);
            authStore.updateManagerId(manager._id);
            authStore.updateManagerData(JSON.stringify(manager));

            // Перенаправляем пользователя на защищенную страницу
            router.push({ name: 'table' });
        }
        console.debug('Login response:', response.data);
    } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
        alert('Неверный логин или пароль');
    } finally {
        loading.value = false;
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