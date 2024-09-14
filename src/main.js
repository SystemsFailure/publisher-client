import "primeflex/primeflex.css";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeicons/primeicons.css";
import PrimeVue from 'primevue/config';
import Menubar from 'primevue/menubar';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { run } from './storage'
import axios from './axios'
import auth from "./auth";
import { createPinia } from 'pinia'

const app = createApp(App)
const { storage } = run();
const pinia = createPinia()

// Регистрация плагинов в правильном порядке
app.use(pinia)
app.use(router)
app.use(axios)
app.use(auth)
app.use(PrimeVue, { ripple: false });
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

app.component('Menubar', Menubar);

app.mount('#app')

export {
    storage,
    router
}