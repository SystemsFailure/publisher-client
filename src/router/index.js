import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FilesView from '@/views/FilesView.vue'
import AvitoPlatformView from '@/views/AvitoPlatformView.vue'
import LoginView from '@/views/Auth/LoginView.vue';
import SignupView from '@/views/Auth/SignupView.vue'
import { useAuthStore } from '@/stores/auth';
import CianPlatformView from '@/views/CianPlatformView.vue';
import YoulaPlatformView from '@/views/YoulaPlatformView.vue';
import DomClickPlatformView from '@/views/DomClickPlatformView.vue';
import SavedTablesView from '@/views/SavedTablesView.vue';
import YandexPlatformView from '@/views/YandexPlatformView.vue';
import OfficesView from '@/views/Settings/OfficesView.vue';
import ManagersView from '@/views/Settings/ManagersView.vue';

const availableRoutes = [
  'login',
  'signup'
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/',
      name: 'table',
      component: HomeView,
    },
    {
      path: '/file',
      name: 'files',
      component: FilesView,
    },
    {
      path: '/platforms/avito',
      name: 'pl-avito',
      component: AvitoPlatformView,
    },
    {
      path: '/platforms/cian',
      name: 'pl-cian',
      component: CianPlatformView,
    },
    {
      path: '/platforms/youla',
      name: 'pl-youla',
      component: YoulaPlatformView,
    },
    {
      path: '/platforms/domclick',
      name: 'pl-domclick',
      component: DomClickPlatformView,
    },
    {
      path: '/platforms/yandex',
      name: 'pl-yandex',
      component: YandexPlatformView,
    },
    {
      path: '/saved-tables',
      name: 'saved-tables',
      component: SavedTablesView,
    },
    {
      path: '/settings/offices',
      name: 'settings-offices',
      component: OfficesView,
    },
    {
      path: '/settings/managers',
      name: 'settings-managers',
      component: ManagersView,
    }
  ]
})

// Добавим глобальный навигационный guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!availableRoutes.includes(to.name) && !authStore.login) {
    // Если пользователь не залогинен, перенаправляем на страницу логина
    next({ name: 'login' });
  } else {
    // Иначе разрешаем переход
    next();
  }
});

export default router
