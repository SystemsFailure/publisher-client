<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import { RouterView } from 'vue-router'
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useNotificationsStore } from '../src/stores/notification';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const http = inject('axios')

// Массив исключенных маршрутов
const excludedRoutes = ['login', 'signup'];

// Реактивное свойство для контроля отображения Menubar
const showMenubar = ref(true);
const managerInfo = ref({
  _id: null,
  login: null,
})

const menu = ref();
const items_ = ref([
  {
    label: 'Выход',
    command: function () {
      localLogout();
      router.push({ name: 'login' });
    }
  }
]);

const localLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('managerId');
  localStorage.removeItem('manager');
  authStore.updateLogin(false);
}

const toggle = (event) => {
  menu.value.toggle(event);
};

const items = ref([
  {
    label: 'Таблица',
    icon: 'pi pi-table',
    command: () => {
      goTable()
    }
  },
  {
    separator: true
  },
  {
    label: 'Файлы',
    icon: 'pi pi-file',
    command: () => {
      goFiles()
    }
  },
  {
    label: 'Объявления',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Авито',
        icon: 'pi pi-cloud-download',
        command: () => {
          router.push({
            name: 'pl-avito'
          })
        }
      },
      {
        label: 'Циан',
        icon: 'pi pi-cloud-upload',
        command: () => {
          router.push({
            name: 'pl-cian'
          })
        }
      },
      {
        label: 'Юла',
        icon: 'pi pi-cloud-upload',
        command: () => {
          router.push({
            name: 'pl-youla'
          })
        }
      },
      {
        label: 'Домклик',
        icon: 'pi pi-cloud-upload',
        disabled: true,
        command: () => {
          router.push({
            name: 'pl-domclick'
          })
        }
      },
      {
        disabled: true,
        label: 'Яндекс',
        icon: 'pi pi-cloud-upload',
        command: () => {
          router.push({
            name: 'pl-yandex'
          })
        }
      },
    ]
  },
  {
    label: 'Сохраненые таблицы',
    icon: 'pi pi-file',
    command: () => {
      router.push({
        name: 'saved-tables'
      })
    }
  },
  {
    label: 'Настройки',
    icon: 'pi pi-settings',
    items: [
      {
        label: 'Офисы',
        command: () => {
          router.push({
            name: 'settings-offices'
          })
        }
      },
      {
        label: 'Маркетологи',
        command: () => {
          router.push({
            name: 'settings-managers'
          })
        }
      },
    ]
  },
]);

onMounted(async () => {
  await fetchManager()
  notificationsStore.initializeSocket('autoloads-room');
})

function goTable() {
  router.push({
    name: 'table',
  })
}

function goFiles() {
  router.push({
    name: 'files',
  })
}

function goUploaded() {
  router.push({
    name: 'uploaded',
  })
}

// Функция для проверки текущего маршрута
function checkRoute() {
  showMenubar.value = !excludedRoutes.includes(route.name);
  if (route.name === 'login' || route.name === 'signup') {
    localLogout();
  }
}

async function fetchManager() {
  if (!authStore.managerId) return;
  const response = await http.get(`/get-manager/${authStore.managerId}`);
  if (!response.data.result) {
    console.log(response.data);
    return;
  }
  if (!response.data.manager || !response.data.manager._id) return;
  authStore.updateManagerId(response.data.manager._id);
  managerInfo.value = {
    _id: response.data.manager._id,
    login: response.data.manager.login,
  }
}

// Проверка текущего маршрута при монтировании компонента
checkRoute();

// Слежение за изменениями маршрута
watch(route, () => {
  checkRoute();
});

watch(useAuthStore().login, async (newValue, oldValue) => {
  if (newValue === true && oldValue === false) {
    console.log('[WATCH] Изменение authStore.login ');
    await fetchManager();
  }
});
</script>

<template>
  <Toast position="bottom-center" group="global"></Toast>
  <div>
    <Menubar v-if="showMenubar" :model="items">
      <template #end>
        <div class="card flex justify-center" style="align-items: center;">
          <h5 class="mr-3">{{ authStore?.managerData?.login || "Ошибка" }}</h5>
          <Button icon="pi pi-user" @click="toggle" severity="contrast" outlined class="custom-button" />
          <Menu ref="menu" id="overlay_menu" :model="items_" :popup="true" />
        </div>
        <!-- <div class="flex items-center gap-2 mr-2" style="align-items: center;">
          <div class="mr-2">{{ managerInfo.login }}</div>
          <Avatar image="user-avatar.png" shape="circle" style="border: 1px solid #000; padding: 5px;"
            class="user-avatar" />
        </div> -->
      </template>
    </Menubar>
    <RouterView />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.user-avatar:hover {
  cursor: pointer;
  opacity: .5;
  transition: .3s;
}

.custom-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-right: 15px;
}
</style>