import { defineStore } from "pinia";


export const UseAdditionalInfoStore = defineStore('additional', {
    state: () => {
        return {
            visibleModalAdditionalInfo: false,
            currentId: '',
        }
    },

    actions: {
        changeVisible(value) {
            this.visibleModalAdditionalInfo = value;
        },
        changeCurrentId(value) {
            this.currentId = value;
        },
    },
})