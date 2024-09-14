import { reactive } from "vue"
import eye from '@/assets/icons/eye_.png';
import upload from '@/assets/icons/upload_.png';
import deleteIcon from '@/assets/icons/trash_.png';
import copy from '@/assets/icons/copy_.png';

import { getActivePinia, createPinia, setActivePinia } from 'pinia';
import { UseAdditionalInfoStore } from '@/stores/additional';
import { UseUploadFilesStore } from '@/stores/uploadFiles';
import { UseRemoveRowStore } from '@/stores/removeRow';


import CustomCellEditor from "@/components/ui/CustomCellEditor.vue";

// Проверяем, была ли Pinia уже активирована
if (!getActivePinia()) {
  setActivePinia(createPinia());
}

class CustomButtonComponent {
  eGui;
  eventListeners = [];

  init(params) {
    this.eGui = document.createElement("div");
    this.eGui.style.display = "flex";
    this.eGui.style.height = "100%";
    this.eGui.style.alignItems = "center";
    this.eGui.style.justifyContent = "center";

    const buttonsData = [
      { color: "#0ea5e9", iconSrc: eye, key: 'eye', tooltip: 'Добавить доп информацию' },
      { color: "#22c55e", iconSrc: upload, key: 'upload', tooltip: 'Загрузить фотографии для объявления' },
      { color: "#ef4444", iconSrc: deleteIcon, key: 'delete', tooltip: 'Удалить текущую строку' },
      { color: '#1D1D1D', iconSrc: copy, key: 'copy', tooltip: 'Скопировать идентификатор объявления' },
    ];

    buttonsData.forEach((btnData) => {
      let eButton = document.createElement("button");
      eButton.className = "btn-simple";
      eButton.style.backgroundColor = '#fff';
      eButton.style.width = "30px";
      eButton.style.height = "30px";
      eButton.style.border = "none";
      eButton.style.margin = "0 5px";
      eButton.style.display = "flex";
      eButton.style.justifyContent = "center";
      eButton.style.alignItems = "center";
      eButton.style.borderRadius = "5px";
      eButton.style.border = `1px solid ${btnData.color}`;
      eButton.style.transition = "opacity 0.3s ease";
      eButton.style.cursor = 'pointer';

      // Устанавливаем подсказку
      eButton.title = btnData.tooltip;

      // Добавляем стили для hover-эффекта
      eButton.addEventListener("mouseover", function () {
        eButton.style.opacity = "0.5"; // Прозрачность при наведении
      });

      eButton.addEventListener("mouseout", function () {
        eButton.style.opacity = "1"; // Возвращение к исходной прозрачности
      });

      let eIcon = document.createElement("img");
      eIcon.src = btnData['iconSrc'];
      eIcon.style.width = "14px";
      eIcon.style.height = "14px";
      eButton.appendChild(eIcon);

      let eventListener = () => {
        const useAdditionalInfoStore = UseAdditionalInfoStore();
        const useUploadFilesStore = UseUploadFilesStore();
        const useRemoveRowStore = UseRemoveRowStore();
        switch (btnData.key) {
          case 'eye':
            useAdditionalInfoStore.changeVisible(true);
            useAdditionalInfoStore.changeCurrentId(params.data.Id);
            break;
          case 'upload':
            const platform = params.data['Площадка'];
            useUploadFilesStore.changeVisible(true);
            useUploadFilesStore.changeCurrentId(params.data.Id);
            useUploadFilesStore.changeSelectedPlatform({ name: platform, code: this.__converterSelectedPlatform(platform) });
            break;
          case 'delete':
            useRemoveRowStore.changeVisible(true);
            useRemoveRowStore.changeCurrentId(params.data.Id);
            break;
          case 'copy':
            const el = document.createElement('textarea');
            el.value = params.data['Id'];
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            break;
          default:
            break;
        }
      };
      eButton.addEventListener("click", eventListener);
      this.eventListeners.push({ button: eButton, listener: eventListener });

      this.eGui.appendChild(eButton);
    });
  }

  // Приватный метод
  __converterSelectedPlatform(platform) {
    const mapPlatforms = {
      'Авито': "avito",
      'Циан': "cian",
      "Юла": "youla",
      "Домклик": "domclick",
      "Яндекс": "yandex",
    };

    return mapPlatforms[platform];
  }

  getGui() {
    return this.eGui;
  }

  refresh() {
    return true;
  }

  destroy() {
    this.eventListeners.forEach(({ button, listener }) => {
      button.removeEventListener("click", listener);
    });
  }
}


export function useDefCols() {
  const columnDefs = reactive([
    { field: "Действия", cellRenderer: CustomButtonComponent, pinned: "right", editable: false },
    {
      field: "Площадка",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Авито",
          "Циан",
          "Юла",
          "Домклик",
          "Яндекс",
        ],
      },
    },
    { field: "Id", editable: false, },
    {
      headerName: "Категория",
      field: "Category",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Квартиры", "Дома, дачи, коттеджи", "Комнаты"],
      },
      onCellValueChanged: (event) => {
        console.log('editing value category !!!', event)
        // Обработчик изменения значения в Category
        const category = event.data['Category'];
        const roomTypeEditor = event?.api?.columnModel?.columnDefs?.filter(el => {
          return el?.headerName === 'Количество комнат';
        })
        console.log('\n', 'event: ', roomTypeEditor);

        if (roomTypeEditor.length !== 0) {
          return;
        }

        if (category === 'Комнаты') {
          if (roomTypeEditor[0] && roomTypeEditor[0].cellEditorParams) {
            roomTypeEditor[0].cellEditorParams.values = [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10 и более",
              "Своб. планировка",
            ];
          }
        } else {
          if (roomTypeEditor[0] && roomTypeEditor[0].cellEditorParams) {
            roomTypeEditor[0].cellEditorParams.values = [
              "Студия",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10 и более",
              "Своб. планировка",
            ];
          }
        }
        event.api.refreshCells({ columns: ['Rooms'] });
      }
    },
    {
      headerName: "Описание",
      field: "Description",
      cellEditor: CustomCellEditor,
      cellEditorPopup: true,
      cellEditorParams: {
        maxLength: 15_000,
      },
    },
    {
      headerName: "Адрес",
      field: "Address",
    },
    {
      headerName: "Тип операции",
      field: "OperationType",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Сдам",
        ],
      },
    },
    {
      headerName: "Цена",
      field: "Price",
    },
    {
      headerName: "Тип комнат",
      field: "RoomType",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Изолированные",
          "Смежные",
        ],
      },
    },
    {
      headerName: "Ремонт",
      field: "Renovation",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Требуется",
          "Косметический",
          "Евро",
          "Дизайнерский",
        ],
      },
    },
    {
      headerName: "Право собственности",
      field: "PropertyRights",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Собственник",
          "Посредник",
        ],
      },
    },
    {
      headerName: "Тип аренды",
      field: "LeaseType",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "На длительный срок",
          "Посуточно",
        ],
      },
    },
    {
      headerName: "Тип дома",
      field: "HouseType",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Кирпичный",
          "Панельный",
          "Блочный",
          "Монолитный",
          "Монолитно-кирпичный",
          "Деревянный",
        ],
      },
    },
    {
      headerName: "Этаж",
      field: "Floor",
    },
    {
      headerName: "Этажность",
      field: "Floors",
    },
    {
      headerName: "Количество комнат",
      field: "Rooms",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Студия",
          "1",
          "2",
          "3",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10 и более",
          "Своб. планировка",
        ],
      },
    },
    {
      headerName: "Общая площадь",
      field: "Square",
    },
    {
      headerName: "Залог",
      field: "LeaseDeposit",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Без залога",
          "0,5 месяца",
          "1 месяц",
          "1,5 месяца",
          "2 месяца",
          "2,5 месяца",
          "3 месяца",
        ],
      },
    },
    {
      headerName: "Размер комиссии в %",
      field: "LeaseCommissionSize",
    },
    {
      headerName: "Площадь кухни",
      field: "KitchenSpace",
    },
    {
      headerName: "Оплата по счетчикам",
      field: "UtilityMeters",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Оплачивается арендатором",
          "Оплачивается собственником",
        ],
      },
    },
    {
      headerName: "Другие ЖКУ",
      field: "OtherUtilities",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Оплачивается арендатором",
          "Оплачивается собственником",
        ],
      },
    },
    {
      headerName: "Плата за другие ЖКУ",
      field: "OtherUtilitiesPayment",
    },
    {
      headerName: "Можно курить",
      field: "SmokingAllowed",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Да",
          "Нет",
        ],
      },
    },
    {
      headerName: "Можно с детьми",
      field: "ChildrenAllowed",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Да",
          "Нет",
        ],
      },
    },
    {
      headerName: "Можно с животными",
      field: "PetsAllowed",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "Да",
          "Нет",
        ],
      },
    },
    {
      headerName: "Номер телефона",
      field: "ContactPhone",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [
          '7 | 9530731420',
          '7 | 9951984530',
          '7 | 9001280322',
          '7 | 9001268400',
          '7 | 9001206865',
          '7 | 9001213933',
          '7 | 9912490640',
          '7 | 9002420408'
        ],
      }
    },
    {
      headerName: "Площадь комнаты",
      field: "RoomArea",
    },
    {
      headerName: "Год постройки",
      field: "BuiltYear",
    },
    // Category
    // AdStatus - optional
    // Description
    // Address
    // OperationType
    // Price
    // RoomType
    // Renovation
    // PropertyRights
    // LeaseType
    // HouseType
    // Floor
    // Floors
    // Rooms
    // Square
    // LeaseDeposit
    // LeaseCommissionSize
    // KitchenSpace
    // UtilityMeters
    // OtherUtilities
    // OtherUtilitiesPayment
    // SmokingAllowed
    // ChildrenAllowed
    // PetsAllowed
    // Phone
    // RoomArea
  ])

  function changeValuesRooms() {
    columnDefs = columnDefs.map(el => {
      if(el.field === 'Rooms') {
        return el.cellEditorParams.values = ['1', '2', '3']
      }
      return el
    })
  }

  return {
    columnDefs: columnDefs, 
    changeValuesRooms: changeValuesRooms,
  }
}