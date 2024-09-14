<template>
    <Dialog v-if="props.visible" v-model:visible="props.visible" maximizable modal header="Настройки офисов"
        :style="{ width: '50rem', padding: '15px' }">
        <div>
            <KeyCard title="Учетные данные Авито" :credentials="props.avitoCredentials" @setup="setupPlatformKeys('avito')" />
            <KeyCard title="Учетные данные Циана" :credentials="props.cianCredentials" @setup="setupPlatformKeys('cian')" />
            <KeyCard title="Учетные данные Юлы" :credentials="props.youlaCredentials" @setup="setupPlatformKeys('youla')" />
            <KeyCard title="Учетные данные Яндекс карт" :credentials="{ tokenApi: props.yandexMapsTokenApiValue }"
                @setup="setupPlatformKeys('yandex')" />
        </div>
        <div class="mt-3">
            <h5 style="font-weight: bold; font-size: 16px;">Сотрудники привязанные к данному офису</h5>
        </div>
        <div>
            <Card>
                <template #title>Сотрудники</template>
                <template #content>
                    <div style="height: 20px; border: 1px solid #999; display: flex; align-items: center; border-radius: 3px;"
                        class="p-3 mt-1" v-for="manager in props.managers" :key="manager._id">
                        <div v-if="!props.hasManagers"> Менеджеров нет </div>
                        <div v-else style="display: flex; align-items: center;">
                            <div>ID: {{ manager._id }}</div>
                            <div class="ml-3">Имя: {{ manager.login }}</div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </Dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import KeyCard from './KeyCard.vue';

const props = defineProps({
    visible: Boolean,
    avitoCredentials: Object,
    cianCredentials: Object,
    youlaCredentials: Object,
    yandexMapsTokenApiValue: String,
    hasManagers: Boolean,
    managers: Array
});

const emit = defineEmits(['setupPlatformKeys']);
</script>