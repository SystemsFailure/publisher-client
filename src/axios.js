import axios from 'axios';
import router from './router';

// Создаем инстанс axios с настройками
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
  }
});

export const setupInterceptors = (router) => {
  instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      if (response.data.redirect) {
        router.push({ name: response.data.redirect });
      }
      // Если сервер вернул новый токен в заголовке Authorization, обновляем его на клиенте
      if (response.headers.authorization) {
        const newToken = response.headers.authorization.split(' ')[1];
        localStorage.setItem('token', newToken);
      }
      return response;
    },
    error => {
      if (error.message === 'Network Error') {
        console.log('Ошибка соединения: сервер не доступен');
        // Здесь можно добавить код для обработки ошибки соединения
        // Например, показ сообщения об ошибке пользователю или другие действия
      }
      if (error.response && error.response.status === 401) {
        // Удаляем токен из локального хранилища и перенаправляем на страницу входа
        localStorage.removeItem('token');
        router.push({ name: 'login' });
      }
      return Promise.reject(error);
    }
  );
};


// Функция для выполнения запросов
export const apiRequest = async (url, method, data = null) => {
  const token = localStorage.getItem('token');
  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`
    },
    data
  };

  try {
    const response = await instance(config);
    return response.data;
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    throw error;
  }
};

export default {
  install: (app) => {
    setupInterceptors(router);
    app.config.globalProperties.$axios = instance;
    app.provide('axios', instance);
  }
};