<template>
    <Toast />
    <div class="custom-cell-editor" style="display: flex; flex-direction: column; align-items: end; padding: 10px;">
        <Textarea v-model="value" rows="5" cols="30" :maxlength="params.maxLength" />
        <Button label="Сохранить" @click="save" size="small" class="mt-2" />
    </div>
</template>

<script>
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { inject } from 'vue';

export default {
    props: {
        params: Object
    },
    data() {
        return {
            value: this.params.value,
            http: null,
            toast: null,
        };
    },
    created() {
        // Инъекцируем axios
        this.http = inject('axios');
        this.toast = useToast();
        if (!this.http) {
            console.error('Axios is not provided!');
        }
    },
    methods: {
        save() {
            this.params.data.Description = this.value;
            // Обновляем значение в параметрах
            this.params.api.getEditingCells().forEach(async cell => {
                if (cell.column.getColId() === this.params.column.getColId()) {
                    this.params.api.stopEditing(true);  // true для сохранения изменений
                    await this.updateAdField(this.params.data.Id, this.params.data);
                }
            });
        },
        async updateAdField(id, data) {
            // Здесь обновляем поле площадки для объявления
            const { data: { message, result } } = await this.http.put('/update-ad-data', {
                id: id,
                data: data
            })
            if (result) {
                this.showToast("success", "Объявление", String(message), 3000);
            }
        },
        showToast(severity, summary, detail, life) {
            this.toast.add({ severity, summary, detail, group: 'bc', life });
        },
    },
    components: {
        Button,
        Textarea,
        Toast,
    },
};
</script>

<style scoped>
.custom-cell-editor {
    display: flex;
    flex-direction: column;
}

.custom-cell-editor textarea {
    resize: none;
    width: 100%;
}

.custom-cell-editor button {
    margin-top: 10px;
}
</style>
