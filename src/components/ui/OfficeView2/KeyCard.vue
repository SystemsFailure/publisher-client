<template>
    <Card>
        <template #title>{{ title }}</template>
        <template #content>
            <div class="flex flex-column gap-2">
                <label for="client-key">Client Key</label>
                <InputText id="client-key" v-model.trim="credentials.clientId" aria-describedby="client-key-help" />
                <small id="client-key-help">Введите client id</small>
            </div>
            <div class="flex flex-column gap-2 mt-3">
                <label for="secret-key">Secret Key</label>
                <InputText id="secret-key" v-model.trim="credentials.secretKey" aria-describedby="secret-key-help" />
                <small id="secret-key-help">Введите секретный ключ</small>
            </div>
            <div class="flex flex-column gap-2 mt-3" v-if="title === 'Учетные данные Юлы'">
                <label for="user-id">Id пользователя</label>
                <InputText id="user-id" v-model.trim="credentials.userId" aria-describedby="user-id-help" />
                <small id="user-id-help">Введите ваш пользовательский id</small>
            </div>
            <div class="flex flex-column gap-2 mt-3" v-if="title === 'Учетные данные Юлы'">
                <label for="user-contact-id">Contact Id пользователя</label>
                <InputText id="user-contact-id" v-model.trim="credentials.userContactId"
                    aria-describedby="user-contact-id-help" />
                <small id="user-contact-id-help">Введите ваш пользовательский contact id</small>
            </div>
            <div class="flex flex-column gap-2 mt-3" v-if="title === 'Учетные данные Юлы'">
                <label for="mail-address">Адрес эл. почты</label>
                <InputText id="mail-address" v-model.trim="credentials.mailAddress"
                    aria-describedby="mail-address-help" />
                <small id="mail-address-help">Введите вашу рабочую эл. почту</small>
            </div>
        </template>
        <template #footer>
            <div class="flex mt-1">
                <div class="ml-auto gap-3">
                    <Button label="Отмена" severity="secondary" outlined class="mr-3" />
                    <Button label="Установить" @click="setupCredentials" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    title: String,
    credentials: Object
});

const emit = defineEmits(['setup']);

const setupCredentials = () => {
    emit('setup');
};
</script>