import { defineStore } from 'pinia';
import socketService from '../services/socket.service';
import { useRoute } from 'vue-router';
import { useAuthStore } from './auth';
import DateService from '@/services/date.service';
// import { useToast } from 'primevue/usetoast';
// const toast = useToast();
import { fetchData, startUpload, handleError, changeStatus } from '@/composables/uploadService';

export const useNotificationsStore = defineStore('notifications', {
    state: () => ({
        notifications: [],
        autoloads: [],
        roomId: null,
        httpClient: null,
    }),
    actions: {
        async fetch(platform, http) {
            try {
                // console.log(`[debug]: ${this.getPlatform}`, useAuthStore().managerId);
                const response = await fetchData(http, `/get-autoloads/${platform}/${useAuthStore().managerId}`);
                const dateService = new DateService();
                this.autoloads = response.map(el => ({
                    ...el,
                    createdAt: dateService.form(el?.createdAt)
                }));
            } catch (error) {
                console.error(error);
            }
        },
        initializeSocket(roomId) {
            this.roomId = roomId;
            socketService.connect('http://localhost:3035'); // URL вашего сокет-сервера
            socketService.joinRoom(roomId);

            socketService.on('notification', (data) => {
                if (data.result === true) {
                    this.notifications.push(data.text);
                }
            });

            socketService.on('toast', (data) => {
                if (data.result === true) {
                    console.log("xxx");
                    // toast.add({severity: 'success', life: 4_500, detail: data.text, group: "global"});
                }
            });

            socketService.on('update:autoload', async (data) => {
                if (data.result === true) {
                    await this.fetch(data.platform, this.httpClient);
                    // if (data.platform === 'avito') {
                    //     await this.fetch('avito', this.httpClient);
                    //     // const routeName = useRoute()?.name;
                    //     // const isNeedRoute = routeName === 'pl-avito'; 

                    //     // if (isNeedRoute) {
                    //     //     console.log("Обновляем список автовыгрузок");
                    //     // }
                    // }

                    // if(data.platform === 'cian') {
                    //     await this.fetch('cian', this.httpClient);
                    //     console.log('Письмо было отложенно отправлено на циан');
                    // }

                    // if(data.platform === 'youla') {
                    //     await this.fetch('youla', this.httpClient);
                    // }
                }
            });

            socketService.on('error:update:autoload', async (data) => {
                console.log(data.result, data.message);
                await this.fetch(data.platform, this.httpClient);
            })
        },

        addNotification(notification) {
            this.notifications.push(notification);
        },

        addToast(toastObj) {
            toast.add(toastObj);
        },

        // updateAutoload(autoloadId, data) {
        //     this.autoloads[autoloadId] = data;
        // },

        clearNotifications() {
            this.notifications = [];
        },

        clearToasts() {
            this.toasts = [];
        },

        setHttpClient(http) {
            this.httpClient = http;
        }

        // clearAutoloads() {
        //     this.autoloads = {};
        // }
    }
});