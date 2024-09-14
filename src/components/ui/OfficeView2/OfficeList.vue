<template>
    <div class="card">
        <DataTable tableStyle="min-width: 30rem" v-model:selection="props.selectedOffice" :value="props.offices"
            selectionMode="single" dataKey="_id" :metaKeySelection="false" @rowSelect="onRowSelect"
            @rowUnselect="onRowUnselect" paginator :rows="props.perPages" :rowsPerPageOptions="props.rowsPerPaginator">
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
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    selectedOffice: Object,
    offices: Array,
    perPages: Number,
    rowsPerPaginator: Array
});

const emit = defineEmits(['rowSelect', 'rowUnselect']);
</script>