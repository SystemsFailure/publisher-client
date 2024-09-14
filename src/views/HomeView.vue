<template>
  <ModalAutoloadDateSelect :visible="visibleAutoloadDateDialog" @closeModal="visibleAutoloadDateDialog = false">
  </ModalAutoloadDateSelect>
  <ConfirmPopup group="del" />
  <ConfirmPopup group="pub">
    <template #message="slotProps">
      <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border p-3 mb-3 pb-0">
        <span>{{ slotProps.message.message }}</span>

        <div class="mb-5 mt-4">
          <FloatLabel>
            <InputText id="feed-name-id" v-model="feedName" autofocus placeholder="Название" />
            <label for="feed-name-id">Введите имя фида</label>
          </FloatLabel>
        </div>
      </div>
    </template>
  </ConfirmPopup>
  <!-- <ConfirmDialog></ConfirmDialog> -->
  <ModalAdditionalInfo :visibleModalAdditionalInfo="useAdditionalInfoStore.visibleModalAdditionalInfo"
    :row-data="rowData" @onSet="onSetHandler" @onSetFurniture="onSetFurnitureHandler"
    @onSetOtherInfo="onSetOtherInfoHandler" @closeModal="useAdditionalInfoStore.visibleModalAdditionalInfo = false">
  </ModalAdditionalInfo>
  <ModalUploadXml :visibleModalUploadeXml="visibleModalUploadeXml" @closeModal="visibleModalUploadeXml = false" />
  <Toast position="bottom-center" group="bc" />
  <Dialog v-model:visible="useRemoveRowStore.visibleRemoveDialog" modal header="Удалить строку по id"
    :style="{ width: '50rem', padding: '15px' }">
    <div>
      <FloatLabel style="margin-bottom: 10px;">
        <InputText id="id" v-model="useRemoveRowStore.currentId" autofocus />
        <label for="id">Идентификатор строки таблицы</label>
      </FloatLabel>
    </div>

    <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
      <Button type="button" label="Отмена" severity="secondary"
        @click="() => useRemoveRowStore.changeVisible(false)"></Button>
      <Button type="button" label="Удалить" @click="removeRow" severity="danger"></Button>
    </div>
  </Dialog>

  <!-- 
    Диалоговое окно для выгрузки файлов для объявления 
  -->
  <Dialog v-model:visible="useUploadFilesStore.visible" maximizable modal header="Загрузить файлы для объявлений"
    :style="{ width: '50rem', padding: '15px' }">

    <div class="card mt-2 mb-8">
      <ProgressBar v-if="filesUploading" mode="indeterminate" style="height: 6px"></ProgressBar>
    </div>

    <div>
      <FloatLabel style="margin-bottom: 10px;">
        <InputText id="id" v-model="useUploadFilesStore.currentId" @blur="handleBlur"
          :invalid="invalidInputValueId ? true : false" autofocus />
        <label for="id">Идентификатор объекта</label>
        <Dropdown style="margin-left: 20px;" v-model="useUploadFilesStore.selectedPlatform" :options="platforms"
          optionLabel="name" :placeholder="'Выберите площадку'" class="w-full md:w-14rem" variant="outlined" />
      </FloatLabel>
      <div class="card">
        <FileUpload customUpload @uploader="sendFiles($event)" @upload="onTemplatedUpload($event)" :multiple="true"
          accept="image/*" :maxFileSize="10000000" :uploadLabel="'Загрузить'" :chooseLabel="'Выбрать'"
          :cancelLabel="'Отменить'" :mode="'advanced'">
          <template #empty>
            <p>Перенесите сюда файл, что бы загрузить</p>
          </template>
          <template #content="{ files, removeFileCallback }">
            <div v-if="filesUploaded?.length && filesUploaded?.length > 0">
              <div class="mb-5">Выгруженные файлы</div>
              <div class="grid">
                <div class="col-12 md:col-6 lg:col-3" v-for="file in filesUploaded" :key="file.url">
                  <Image :src="file.url" alt="Image" width="150" height="150" preview />
                </div>
              </div>
            </div>
            <div class="mb-5 mt-3">Текущие файлы для выгрузки</div>
            <div class="grid">
              <div class="col-12 md:col-6 lg:col-3" v-for="(file, index) in files" :key="file.webkitRelativePath">
                <Image :src="createObjectURL(file)" alt="Image" width="150" height="150" preview />
                <i class="pi pi-times remove_icon" @click="removeFileCallback(index)"></i>
              </div>
            </div>
          </template>
        </FileUpload>
      </div>
    </div>
  </Dialog>

  <div class="grid nested-grid">
    <div class="col-10">
      <div class="grid">
        <div class="col-12">
          <div
            style="padding: 20px; height:92vh; width:100%; display: flex; align-items: center; justify-content: center;">
            <!-- Таблица -->
            <ag-grid-vue style="height: 100%; width: 100%;" :class="'ag-theme-quartz'" :columnDefs="columnDefs"
              :gridOptions="gridOptions" @grid-ready="onGridReady" :rowData="rowData" :defaultColDef="defaultColDef"
              :rowSelection="rowSelection" :suppressRowClickSelection="true" :pagination="true"
              :paginationPageSize="paginationPageSize" :paginationPageSizeSelector="paginationPageSizeSelector"
              @cellClicked="onCellClicked($event)" :suppressCellFlash="true" @cellValueChanged="onCellValueChanged">
            </ag-grid-vue>
          </div>
        </div>
      </div>
    </div>
    <div class="col-2">
      <div style="padding: 20px; height: auto; width:100%; display: flex; flex-direction: column;">
        <Button label="Добавить строку" :icon="PrimeIcons.PLUS" severity="info" :disabled="loading" outlined
          @click="addRow" />
        <Button label="Запросить новый excel" :icon="PrimeIcons.DOWNLOAD" severity="info" :disabled="loading" outlined
          @click="downloadExcelFile()" style="margin-top: 5px;" />
        <Button label="Выгрузить excel" :icon="PrimeIcons.UPLOAD" severity="success" :disabled="loading" outlined
          @click="openModalUploadXml" style="margin-top: 5px;" />
        <Button label="Сохранить таблицу" :icon="PrimeIcons.SAVE" severity="success" :disabled="loading" outlined
          @click="saveState" style="margin-top: 5px;" />
        <Button label="Удалить все строки" :icon="PrimeIcons.TRASH" severity="danger" :disabled="loading" outlined
          @click="confirm1($event)" style="margin-top: 5px;" />
        <Button label="Опубликовать" :icon="PrimeIcons.SUN" severity="contrast" :loading="loading" outlined
          @click="confirmPublic($event)" style="margin-top: 5px;" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import ModalUploadXml from '@/components/ModalUploadXml.vue'
import ModalAdditionalInfo from '@/components/ModalAdditionalInfo.vue'
import { onMounted, ref, inject, watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { PrimeIcons } from 'primevue/api';
import ConfirmPopup from 'primevue/confirmpopup';

import { useDefCols } from '../composables/useDefColumns';
import { useDefaultRow } from '../composables/useDefaultRow';
import { v4 as uuidv4 } from 'uuid';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import Image from 'primevue/image';
import Card from 'primevue/card';
import ModalAutoloadDateSelect from '@/components/ModalAutoloadDateSelect.vue';
import ProgressBar from 'primevue/progressbar';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import { UseAdditionalInfoStore } from '@/stores/additional';
const useAdditionalInfoStore = UseAdditionalInfoStore();

import { UseUploadFilesStore } from '@/stores/uploadFiles';
const useUploadFilesStore = UseUploadFilesStore();

import { UseRemoveRowStore } from '@/stores/removeRow';
import { reactive } from 'vue';
const useRemoveRowStore = UseRemoveRowStore();

const toast = useToast();
const confirm = useConfirm();

const filesUploading = ref(false);

const confirmPublic = (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'pub',
    message: 'Вы уверены, что хотите опубликовать данные таблицы?',
    header: 'Подтверждение',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Опубликовать',
    rejectLabel: 'Отмена',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-success',
    accept: async () => await upload(),
  });
};

const confirm1 = () => {
  confirm.require({
    target: event.currentTarget,
    group: 'del',
    message: 'Вы уверены что хотите удалить все строки из таблицы?',
    header: 'Подтверждение',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-sm p-button-danger',
    acceptLabel: 'Удалить',
    rejectLabel: 'Отмена',
    accept: async () => {
      saveState();
      rowData.value.length = 0;
      await updateTableStatus();
      currentTableId.value = null;
      toast.add({ severity: 'info', summary: 'Подтверждение', detail: 'Все строки были удалены', life: 3000 });
      saveLocalStorageRow();
    },
    reject: () => { }
  });
};

// const confirmUpload = () => {
//   confirm.require({
//     message: 'Вы уверены что хотите выполнить публикацию всех объектов из таблицы?',
//     header: 'Подтверждение',
//     icon: 'pi pi-exclamation-triangle',
//     rejectProps: {
//       label: 'Отмена',
//       severity: 'secondary',
//       outlined: true
//     },
//     acceptProps: {
//       severity: 'danger',
//       label: 'Удалить'
//     },
//     accept: () => upload(),
//     reject: () => { }
//   });
// };

const loading = ref(false);
const platforms = ref([
  { name: 'Авито', code: 'avito' },
  { name: 'Циан', code: 'cian' },
  { name: 'Юла', code: 'youla' },
  { name: 'Домклик', code: 'domclick' },
  { name: 'Яндекс', code: 'yandex' },
]);
const feedName = ref('');

// Инициализация инструментов
const http = inject('axios')
const authStore = useAuthStore();

const { columnDefs } = useDefCols();
const { defaultRow, updateDefaultRow } = useDefaultRow();

const successUploaded = ref(false);
const visibleModalUploadeXml = ref(false);
const invalidInputValueId = ref(false);
// Если файлы уже загружены для данного объекта
const filesUploaded = ref([]);
const visibleAutoloadDateDialog = ref(false);


const createObjectURL = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Настройки для таблицы
*/
const currentTableId = ref('');
const currentTable = ref(null);
const gridApi = ref();
const rowData = ref([]);
const rowSelection = ref(null);
const paginationPageSize = ref(null);
const paginationPageSizeSelector = ref(null);
const onGridReady = (params) => {
  gridApi.value = params.api;
};
const defaultColDef = ref({
  editable: true,
});

function onCellClicked(event) {
  if (event.colDef.editable) {
    event.api.startEditingCell({
      rowIndex: event.rowIndex,
      colKey: event.column.colId
    });
  }
}

async function updateAdField(id, field) {
  // Здесь обновляем поле площадки для объявления
  const { data: { message, result } } = await http.put('/update-ad-field', {
    id: id,
    field: field
  })
  if (result) {
    showToast("success", "Объявление", String(message), 3000);
  }
}

const gridOptions = ref({
  onCellValueChanged: async (event) => {
    if (event.colDef.field === 'Category') {
      const gridApi = event.api;
      const renderedNodes = gridApi.getRenderedNodes();
      // Преобразуем узлы в данные строк
      const visibleRows = renderedNodes.map(node => node.data);
      console.log('Visible rows:', visibleRows);


      // Получаем данные строки, в которой произошли изменения
      const rowNode = event.node;
      console.log('rowNode', rowNode);

      // Если нужно обновить только одну ячейку:
      await rowNode.setDataValue('Rooms', ['1', '2', 'ppp']);

      console.log('Updated row data: ', rowNode.data, rowNode);
    }

    // Обработка изменений в ячейке
    if (event.colDef.field === "Площадка") {
      await updateAdField(event.data.Id, event.newValue);
    }

    // TODO: Доработать эту часть, что бы менялось только для конкретной строки
    // if (event.colDef.field === 'Category') {
    //   let res = event.columnApi.getColumns();
    //   res = res.filter(el => el.colId === 'Rooms')
    //   // res[0].colDef.cellEditorParams.values = ['1'];
    //   console.log('event changed category: ', event);
    // }
    await updateTableField();
  },
})

async function createAd(it) {
  loading.value = true;
  try {
    const response = await http.post('/create-ad', {
      ads: [it],
      platform: it['Площадка']
    })
    console.log(response);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function updateTableField() {
  const { data: { message, result, _ } } = await http.put('/update-table-field', {
    tableId: currentTableId.value,
    field: JSON.stringify(rowData.value),
  })
}

async function updateTableStatus() {
  if (!currentTableId.value) {
    return;
  }
  loading.value = true;
  try {
    console.log('awdawdadw', currentTable.value);
    const { data: { result, message } } = await http.post(`/update-table-status/${currentTableId.value}`, {
      status: 'База'
    })
    if (!result) {
      showToast("error", "Обновление статуса", message, 3000);
    }
    showToast("success", "Обновление статуса", message, 3000);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

watch(rowData, async (newValue, oldValue) => {
  let previousLength = oldValue.length;

  if (newValue.length > previousLength) {
    // Новый объект был добавлен
    const new_object = newValue[newValue.length - 1]; // Получаем последний добавленный объект
    if (new_object) {
      await createAd(new_object);
      await updateTableField();
    }
  }
});

async function saveState() {
  try {
    await http.post('/save-table', {
      data: {
        tableId: currentTableId.value,
        data: JSON.stringify(rowData.value),
        manager: authStore.managerId,
      },
    });
    showToast("success", "Сохранение", "Таблица успешно сохранена", 3000);
  } catch (error) {
    console.error("Error saving table:", error);
  }
}

onMounted(async () => {
  await Promise.all([
    await initializeTable(),
    await fetchOfficeCredentials(),
    await getAdsFiles(),
  ])
});

const downloadExcelFile = async () => {
  try {
    const response = await http.get('/get-new-excel', {
      responseType: 'blob' // Важно для работы с двоичными данными
    });

    // Создание URL для скачивания файла
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Установка имени файла
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `${uuidv4()}-download.xlsx`;
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
};

async function removeRow() {
  const valueToRemove = useRemoveRowStore.currentId;

  if (valueToRemove) {
    // Найти индекс элемента, который нужно удалить
    const index = rowData.value.findIndex(el => el.Id === valueToRemove);

    if (index !== -1) {
      rowData.value.splice(index, 1);
      await updateTableField();
      useRemoveRowStore.changeVisible(false);
    }
  }
}

async function fetchTable() {
  loading.value = true;
  try {
    const { data: { result, table, message } } = await http.post('/get-table-by-status', {
      status: 'Текущая',
      managerId: authStore.managerId,
    })

    if (!result) {
      showToast("error", "Таблица", String(message), 3000);
      return;
    }

    rowData.value = JSON.parse(table.data);
    currentTableId.value = table._id;
    currentTable.value = table;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function initializeTable() {
  // getFromLocalStorageRow();
  await fetchTable();
  rowSelection.value = "multiple";
  paginationPageSize.value = 25;
  paginationPageSizeSelector.value = [10, 25, 50];
}

function addRow() {
  rowData.value = [...rowData.value, { ...defaultRow.value }];
  updateDefaultRow();
  saveLocalStorageRow();
}

function saveLocalStorageRow() {
  localStorage.setItem('table:rows', JSON.stringify(rowData.value));
}

function getFromLocalStorageRow() {
  const item = localStorage.getItem('table:rows');
  if (item) {
    try {
      rowData.value = JSON.parse(item);
    } catch (e) {
      console.error('Error parsing local storage data:', e);
    }
  }
}

async function upload() {
  if (!feedName.value) {
    showToast('error', 'Автовыгрузка', 'Введите имя фида');
    return;
  }

  try {
    loading.value = true;
    const response = await http.post(`/upload-json/${authStore.managerId}`, {
      jsonObject: JSON.stringify(rowData.value),
      feedName: feedName.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      successUploaded.value = true;
      showToast("success", "Автовыгрузка", "Автовыгрузка была успешно завершена", 3000);
      saveState();
    }
  } catch (error) {
    console.error('There was an error making the request:', error);
  } finally {
    loading.value = false;
  }
}

function uploadFiles() {
  useUploadFilesStore.changeVisible(true);
}

async function getAdsFiles() {
  const id = useUploadFilesStore.currentId;

  const { data: { files, result }, status } = await http.post('/get-all-ads-files-by-id', {
    filter: {
      adId: id
    }
  })
  if (status === 200 && result === true) {
    filesUploaded.value = files
  }
}

async function handleBlur() {
  await getAdsFiles();
}

function onTemplatedUpload() {
  showToast("info", "Success", "Файлы были успешно загружены", 3000);
}

function openModalUploadXml() {
  visibleModalUploadeXml.value = true;
}

function showToast(severity, summary, detail, life) {
  toast.add({ severity, summary, detail, group: 'bc', life });
}


async function sendFiles(event) {
  filesUploading.value = true;
  try {
    const files = event.files;
    const adId = useUploadFilesStore.currentId;
    const platform = useUploadFilesStore.selectedPlatform;

    // Проверка всех обязательных полей
    if (!files || files.length === 0) {
      throw new Error('Файлы не выбраны либо не валидны');
    }

    if (!adId) {
      throw new Error(`Не валидное значение для идентификатора: ${adId}`);
    }

    if (!platform) {
      throw new Error(`Не выбрана площадка: ${platform}`);
    }

    if (!invalidInputValueId) {
      throw new Error(`Не найден введенный идентификатор: ${adId}`);
    }

    // Создание FormData и добавление файлов
    const formData = new FormData();
    formData.append('adId', adId);
    formData.append('platform', platform.code);
    Array.from(files).forEach(file => formData.append('files', file));

    // Отправка запроса
    const response = await http.post('/upload-ads-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data || !response.data.paths) {
      throw new Error(`Результат не содержит массив с адресами фотографий: ${response.data.paths}`);
    }

    // Устанавливаем загруженные файлы для объекта
    // Находим объект с соответствующим Id и обновляем его ImageUrls
    const updatedRowData = rowData.value.map(el => {
      if (String(el.Id).trim().toUpperCase() === String(adId).trim().toUpperCase()) {
        // Создаем новый массив ImageUrls, объединяя уже существующие url и новые из response.data.paths
        const updatedImageUrls = [
          ...(el.ImageUrls || []),  // Добавляем уже существующие url, если они есть
          ...response.data.paths.map(path => ({ url: path }))
        ];

        // Возвращаем обновленный объект с новым массивом ImageUrls
        return {
          ...el,
          ImageUrls: updatedImageUrls
        };
      }
      return el;  // Возвращаем неизмененный объект, если Id не совпадает
    });

    // Обновляем значение rowData.value
    rowData.value = updatedRowData;

    toast.add({ severity: "success", summary: "Загрузка файлов", detail: "Файлы успешно загружены", life: 3000 });
    await updateTableField();

    await getAdsFiles();
  } catch (error) {
    console.error(error);
    toast.add({ severity: "error", summary: "Ошибка загрузки", detail: error.message, life: 3000 });
  } finally {
    filesUploading.value = false;
  }
}

function updateRowData(id, newData) {
  rowData.value = rowData.value.map(el => {
    if (el.Id === id) {
      return { ...el, ...newData };
    }
    return el;
  });
}

function onSetHandler(newData, id) {
  updateRowData(id, { LeaseAppliances: newData });
}

function onSetFurnitureHandler(newData, id) {
  updateRowData(id, { Furniture: newData });
}

async function onSetOtherInfoHandler(newData, id) {
  const {
    leaseMultimedia: LeaseMultimedia,
    leaseComfort: LeaseComfort,
    parkingAdditionally: ParkingAdditionally,
    bathroomMulti: BathroomMulti,
    parking: Parking,
    wallsType: WallsType, 
    landArea: LandArea,
    objectType: ObjectType,
  } = newData || {};
  updateRowData(id, {
    LeaseMultimedia,
    LeaseComfort,
    ParkingAdditionally,
    BathroomMulti,
    Parking,
    WallsType, 
    LandArea,
    ObjectType,
  });

  await updateTableField();
}

const avitoCredentials = reactive({
  clientId: null,
  secretKey: null,
  mailAddress: null,
});

const cianCredentials = reactive({
  clientId: null,
  mailAddress: null,
})

const youlaCredentials = reactive({
  tokenApi: null,
  mailAddress: null,
  userId: null,
  userContactId: null,
})


function findOfficeCredentials(officeCredential, findValue) {
  const foundCred = officeCredential.find(el => el['platform'] === findValue);
  if (!foundCred || foundCred?.length === 0) {
    console.log("Credentials not setuped");
    return;
  }
  return foundCred
}

async function fetchOfficeCredentials() {
  if (!authStore?.managerData?.officeId) {
    return;
  };

  const { data: { result, message, officeCredential } } = await http.get(`/get-office-credentials/${String(authStore?.managerData?.officeId)}`);

  if (!result) {
    toast.add({ severity: "error", summary: "Ошибка", detail: message, life: 3000 });
  }

  const avitoCred = findOfficeCredentials(officeCredential, 'avito');
  const cianCred = findOfficeCredentials(officeCredential, 'cian');
  const youlaCred = findOfficeCredentials(officeCredential, 'youla');

  if (avitoCred) {
    avitoCredentials.clientId = JSON.parse(avitoCred.credentials).clientId;
    avitoCredentials.secretKey = JSON.parse(avitoCred.credentials).secretKey;
    avitoCredentials.mailAddress = JSON.parse(avitoCred.credentials).mailAddress;
  }

  if (cianCred) {
    cianCredentials.clientId = JSON.parse(cianCred.credentials).clientId;
    cianCredentials.mailAddress = JSON.parse(cianCred.credentials).mailAddress;
  }

  if (youlaCred) {
    youlaCredentials.tokenApi = JSON.parse(youlaCred.credentials).tokenApi;
    youlaCredentials.mailAddress = JSON.parse(youlaCred.credentials).mailAddress;
    youlaCredentials.userId = JSON.parse(youlaCred.credentials).userId;
    youlaCredentials.userContactId = JSON.parse(youlaCred.credentials).userContactId;
  }

}

// Установка ключей различных платформ
async function setupPlatformKeys(platform) {
  // const { hasAvito, hasCian, hasYoula } = validateCredentials();
  // console.log('credentials data: ', avitoCredentials.clientId, authStore?.managerData?.officeId, String(authStore?.managerData?.officeId));
  const { data: { message, result } } = await http.post(`/setup-platform-keys/${platform}/${String(authStore?.managerData?.officeId)}`, {
    avito: {
      clientId: avitoCredentials.clientId,
      secretKey: avitoCredentials.secretKey,
      mailAddress: avitoCredentials.mailAddress,
    },
    cian: {
      clientId: cianCredentials.clientId,
      mailAddress: cianCredentials.mailAddress,
    },
    youla: {
      tokenApi: youlaCredentials.tokenApi,
      mailAddress: youlaCredentials.mailAddress,
      userId: youlaCredentials.userId,
      userContactId: youlaCredentials.userContactId,
    },
  })

  if (!result) {
    toast.add({ severity: "error", summary: "Ошибка", detail: message, life: 3000 });
  }

  toast.add({ severity: "success", summary: "Установка ключей", detail: message, life: 3000 });
}


</script>

<style scoped>
.remove_icon:hover {
  cursor: pointer;
  opacity: .5;
}
</style>
