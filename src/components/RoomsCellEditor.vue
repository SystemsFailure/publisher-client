<!-- RoomsCellEditor.vue -->
<template>
    <select v-model="selectedValue" @change="onChange">
        <option v-for="val in values" :value="val" :key="val">{{ val }}</option>
    </select>
</template>

<script setup>
import { ref, watch } from 'vue';

// Пропсы, которые будут переданы компоненту
const props = defineProps({
    value: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update:value']);

const selectedValue = ref(props.value);

// Watcher для обновления значения при изменении
watch(() => props.value, (newValue) => {
    selectedValue.value = newValue;
});

// Обработчик изменения значения
const onChange = () => {
    emit('update:value', selectedValue.value);
};
</script>