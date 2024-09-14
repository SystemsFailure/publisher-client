import { defineStore } from "pinia";


export const UseRemoveRowStore = defineStore('removeRowStore', {
    state: () => {
        return {
            visibleRemoveDialog: false,
            currentId: '',
        }
    },

    actions: {
        changeVisible(value) {
            this.visibleRemoveDialog = value;
        },
        changeCurrentId(value) {
            this.currentId = value;
        },
    },
})