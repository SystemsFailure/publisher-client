import { defineStore } from "pinia";


export const UseUploadFilesStore = defineStore('uploadFiles', {
    state: () => {
        return {
            visible: false,
            currentId: '',
            selectedPlatform: '',
        }
    },

    actions: {
        changeVisible(value) {
            this.visible = value;
        },
        changeCurrentId(value) {
            this.currentId = value;
        },
        changeSelectedPlatform(value) {
            this.selectedPlatform = value;
        }
    },
})