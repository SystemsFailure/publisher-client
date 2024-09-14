import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const login = ref(JSON.parse(localStorage.getItem('login')) || false);
    const managerId = ref(localStorage.getItem('managerId') || null);
    const managerData = ref(JSON.parse(localStorage.getItem('manager')) || null);

    const updateManagerData = (value) => {
        managerData.value = value;
        localStorage.setItem('manager', value);
    }

    const updateLogin = (value) => {
        login.value = value;
        localStorage.setItem('login', JSON.stringify(value));
    };

    const updateManagerId = (value) => {
        managerId.value = value;
        localStorage.setItem('managerId', value);
    };

    // Автоматическое обновление localStorage при изменении значений
    watch(login, (newValue) => {
        localStorage.setItem('login', JSON.stringify(newValue));
    });

    watch(managerId, (newValue) => {
        localStorage.setItem('managerId', newValue);
    });

    return { login, updateLogin, managerId, updateManagerId, managerData, updateManagerData };
});