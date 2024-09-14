<template>
  <Dialog v-model:visible="props.visibleModalAdditionalInfo" maximizable modal
    header="Установить дополнительную информацию для объекта" :style="{ width: '50rem', padding: '15px' }">
    <template #closeicon>
      <i class="pi pi-times remove_icon" @click="emit('closeModal')"></i>
    </template>
    <div>
      <h5 class="mb-5">{{ platformAd }}</h5>
      <FloatLabel style="margin-bottom: 10px;">
        <InputText id="input-id" v-model="useAdditionalInfoStore.currentId" @blur="handleBlur"
          :invalid="invalidInputValueId ? true : false" autofocus />
        <label for="input-id">Идентификатор объекта</label>
      </FloatLabel>
    </div>

    <div class="card">
      <Fieldset legend="Внимание">
        <p class="m-0">
          В зависимости от введенного идентификатора будет определяться платформа для публикации объявления. На основе
          этой
          информации будет осуществляться корректировка данных: некоторые поля будут отключены, если платформа, на
          которую
          публикуется объявление, не поддерживает соответствующие данные.
        </p>
      </Fieldset>
    </div>

    <div class="mt-2" v-if="foundElementRow?.Category === 'Дома, дачи, коттеджи'">
      <h4>Доп. параметры для "Дома, дачи, коттеджи"</h4>
    </div>

    <div class="card p-2" v-if="foundElementRow?.Category === 'Дома, дачи, коттеджи'">
      <div class="grid p-fluid gap-0">
        <div class="col-12 md:col-4 flex align-items-center">
          <Dropdown v-model="WallsType" :options="wallsTypes" optionLabel="name" placeholder="Выберите тип стен" optionValue="key"
            class="w-full" />
        </div>

        <div class="col-12 md:col-4 flex align-items-center">
          <Dropdown v-model="ObjectType" :options="objectTypes" optionLabel="name" placeholder="Выберите вид объекта" optionValue="key"
            class="w-full" />
        </div>

        <div class="col-12 md:col-4 flex align-items-center">
          <FloatLabel>
            <InputText id="land-area-input-id" v-model="LandArea" />
            <label for="land-area-input-id">Площадь участка</label>
          </FloatLabel>
        </div>
      </div>
    </div>

    <div>
      <h4>Техника</h4>
    </div>
    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.AirConditioning" inputId="AirConditioning" name="AirConditioning"
              :value="true" />
            <label for="AirConditioning" class="ml-2">{{ formatLabel('AirConditioning') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Refrigerator" inputId="Refrigerator" name="Refrigerator" :value="true" />
            <label for="Refrigerator" class="ml-2">{{ formatLabel('Refrigerator') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Stove" inputId="Stove" name="Stove" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Stove" class="ml-2">{{ formatLabel('Stove') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Microwave" inputId="Microwave" name="Microwave" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Microwave" class="ml-2">{{ formatLabel('Microwave') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.WashingMachine" inputId="WashingMachine" name="WashingMachine"
              :value="true" />
            <label for="WashingMachine" class="ml-2">{{ formatLabel('WashingMachine') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Dishwasher" inputId="Dishwasher" name="Dishwasher" :value="true" />
            <label for="Dishwasher" class="ml-2">{{ formatLabel('Dishwasher') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.WaterHeater" inputId="WaterHeater" name="WaterHeater" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="WaterHeater" class="ml-2">{{ formatLabel('WaterHeater') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.TV" inputId="TV" name="TV" :value="true" />
            <label for="TV" class="ml-2">{{ formatLabel('TV') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Iron" inputId="Iron" name="Iron" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Iron" class="ml-2">{{ formatLabel('Iron') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseAppliances.Hairdryer" inputId="Hairdryer" name="Hairdryer" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Hairdryer" class="ml-2">{{ formatLabel('Hairdryer') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4>Мебель</h4>
      <!-- добавить аналогичный блок для мебели -->
    </div>

    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="furniture.Beds" inputId="Beds" name="Beds" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Beds" class="ml-2">{{ formatLabel('Beds') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="furniture.Cabinets" inputId="Cabinets" name="Cabinets" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Cabinets" class="ml-2">{{ formatLabel('Cabinets') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="furniture.Kitchen" inputId="Kitchen" name="Kitchen" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Kitchen" class="ml-2">{{ formatLabel('Kitchen') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseMultimedia.Wifi" inputId="Wifi" name="Wifi" :value="true" />
            <label for="Wifi" class="ml-2">{{ formatLabel('Wifi') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4>Комфорт</h4>
    </div>

    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="leaseComfort.Fireplace" inputId="Fireplace" name="Fireplace" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Fireplace" class="ml-2">{{ formatLabel('Fireplace') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseComfort.BalconyLoggia" inputId="BalconyLoggia" name="BalconyLoggia" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="BalconyLoggia" class="ml-2">{{ formatLabel('BalconyLoggia') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="leaseComfort.Parking" inputId="Parking" name="Parking" :value="true" />
            <label for="Parking" class="ml-2">{{ formatLabel('Parking') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4>Тип парковки</h4>
    </div>

    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="parkingAdditionally.Free" inputId="Free" name="Free" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="Free" class="ml-2">{{ formatLabel('Free') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="parkingAdditionally.ForTrucks" inputId="ForTrucks" name="ForTrucks" :value="true"
              :disabled="platformAd === 'Циан'" />
            <label for="ForTrucks" class="ml-2">{{ formatLabel('ForTrucks') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4>Виды парковки</h4>
    </div>

    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="parking.BehindBarrierYard" inputId="BehindBarrierYard" name="BehindBarrierYard"
              :value="true" :disabled="isDisabled('BehindBarrierYard')" />
            <label for="BehindBarrierYard" class="ml-2" :disabled="platformAd === 'Циан'">{{
    formatLabel('BehindBarrierYard') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="parking.GroundLevelMultilevel" inputId="GroundLevelMultilevel"
              name="GroundLevelMultilevel" :value="true" :disabled="isDisabled('GroundLevelMultilevel')" />
            <label for="GroundLevelMultilevel" class="ml-2">{{ formatLabel('GroundLevelMultilevel') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="parking.OpenYard" inputId="OpenYard" name="OpenYard" :value="true"
              :disabled="isDisabled('OpenYard')" />
            <label for="OpenYard" class="ml-2">{{ formatLabel('OpenYard') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="parking.Underground" inputId="Underground" name="Underground" :value="true"
              :disabled="isDisabled('Underground')" />
            <label for="Underground" class="ml-2">{{ formatLabel('Underground') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h4>Санузел</h4>
    </div>

    <div>
      <div class="card">
        <div class="card flex flex-wrap justify-content-center gap-3">
          <div class="flex align-items-center">
            <Checkbox v-model="bathroomMulti.Combined" inputId="Combined" name="Combined" :value="true" />
            <label for="Combined" class="ml-2">{{ formatLabel('Combined') }}</label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="bathroomMulti.Separate" inputId="Separate" name="Separate" :value="true" />
            <label for="Separate" class="ml-2">{{ formatLabel('Separate') }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-content-end gap-2" style="margin-top: 20px;">
      <Button type="button" label="Отмена" severity="secondary" @click="$emit('closeModal')"></Button>
      <Button type="button" label="Установить" @click="onSet"></Button>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import Fieldset from 'primevue/fieldset';
import Dropdown from 'primevue/dropdown';

import { UseAdditionalInfoStore } from '@/stores/additional';
const useAdditionalInfoStore = UseAdditionalInfoStore();

const platformAd = ref('');
const invalidInputValueId = ref();
const { emit } = getCurrentInstance();

const leaseAppliances = ref({
  AirConditioning: false,
  Refrigerator: false,
  Stove: false,
  Microwave: false,
  WashingMachine: false,
  Dishwasher: false,
  WaterHeater: false,
  TV: false,
  Iron: false,
  Hairdryer: false,
});

const furniture = ref({
  Kitchen: false,
  Cabinets: false,
  Beds: false,
})

const leaseMultimedia = ref({
  Wifi: false,
})

const leaseComfort = ref({
  Fireplace: false,
  BalconyLoggia: false,
  Parking: false,
})

const parkingAdditionally = ref({
  Free: false,
  ForTrucks: false,
})

const bathroomMulti = ref({
  Combined: false,
  Separate: false,
})

const parking = ref({
  Underground: false,
  GroundLevelMultilevel: false,
  OpenYard: false,
  BehindBarrierYard: false,
})

const selectedParking = ref({
  value: 0,
  fill: false,
});

const documents = ref('');

// Дома, дачи, коттеджи
const WallsType = ref();
const LandArea = ref();
const ObjectType = ref();
const wallsTypes = ref([
  { name: 'Кирпич', key: 'Кирпич' },
  { name: 'Брус', key: 'Брус' },
  { name: 'Бревно', key: 'Бревно' },
  { name: 'Газоблоки', key: 'Газоблоки' },
  { name: 'Металл', key: 'Металл' },
  { name: 'Пеноблоки', key: 'Пеноблоки' },
  { name: 'Сэндвич-панели', key: 'Сэндвич-панели' },
  { name: 'Ж/б панели', key: 'Ж/б панели' },
  { name: 'Экспериментальные материалы', key: 'Экспериментальные материалы' },
]);
const objectTypes = ref([
  { name: 'Дом', key: 'Дом' },
  { name: 'Дача', key: 'Дача' },
  { name: 'Коттедж', key: 'Коттедж' },
  { name: 'Таунхаус', key: 'Таунхаус' },
]);

const foundElementRow = ref(null);

const props = defineProps(['visibleModalAdditionalInfo', 'rowData']);

function handleEscape() {
  if (event.key === 'Escape') {
    emit('closeModal')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
})

function onSet() {
  const leaseAppliancesCopy = normalizeObjectArrays(leaseAppliances.value);
  const furnitureCopy = normalizeObjectArrays(furniture.value);
  const leaseMultimediaCopy = normalizeObjectArrays(leaseMultimedia.value);
  const leaseComfortCopy = normalizeObjectArrays(leaseComfort.value);
  const parkingAdditionallyCopy = normalizeObjectArrays(parkingAdditionally.value);
  const bathroomMultiCopy = normalizeObjectArrays(bathroomMulti.value);
  const parkingCopy = normalizeObjectArrays(parking.value);

  emit('onSet', leaseAppliancesCopy, useAdditionalInfoStore.currentId);
  emit('onSetFurniture', furnitureCopy, useAdditionalInfoStore.currentId);

  // Pick
  const otherInfo = {
    leaseMultimedia: leaseMultimediaCopy,
    leaseComfort: leaseComfortCopy,
    parkingAdditionally: parkingAdditionallyCopy,
    bathroomMulti: bathroomMultiCopy,
    parking: parkingCopy,
  }

  if (foundElementRow) {
    if (foundElementRow.value.Category === 'Дома, дачи, коттеджи') {
      otherInfo.wallsType = WallsType.value;
      otherInfo.objectType = ObjectType.value;
      otherInfo.landArea = LandArea.value;
    }
  }

  emit('onSetOtherInfo', {
    ...otherInfo,
  }, useAdditionalInfoStore.currentId);
  emit('closeModal')
}

function normalizeObjectArrays(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value === undefined || value === null) {
          return [key, false]
        }
        return [key, value[1]];
      }
      return [key, value];
    })
  );
}

function handleBlur() {
  const id = useAdditionalInfoStore.currentId;
  const exists = props?.rowData?.some(obj => obj.Id === id);
  if (exists) {
    foundElementRow.value = props.rowData?.filter(el => el.Id === id)[0];
    invalidInputValueId.value = false;
  } else {
    invalidInputValueId.value = true;
  }
  if (exists) {
    getAdditionalInfoById(id);
    platformAd.value = props?.rowData?.filter(obj => obj.Id === id)[0]['Площадка'];
  }
}

function getAdditionalInfoById(id) {
  if (!id) return;

  const ad = props.rowData.filter(el => el.Id === id)[0];
  if (ad) {
    const appliances = ad.LeaseAppliances;
    const furniture_ = ad.Furniture;
    const leaseMultimedia_ = ad.LeaseMultimedia;
    const leaseComfort_ = ad.LeaseComfort;
    const parkingAdditionally_ = ad.ParkingAdditionally;
    const bathroomMulti_ = ad.BathroomMulti;
    const parking_ = ad.Parking;
    const wallsType_ = ad?.WallsType;
    const landArea_ = ad?.LandArea;
    const objectType_ = ad?.ObjectType;

    ad.LeaseAppliances ? leaseAppliances.value = normalizeValuesInArray(appliances) : undefined;
    ad.Furniture ? furniture.value = normalizeValuesInArray(furniture_) : undefined;
    ad.LeaseMultimedia ? leaseMultimedia.value = normalizeValuesInArray(leaseMultimedia_) : undefined;
    ad.LeaseComfort ? leaseComfort.value = normalizeValuesInArray(leaseComfort_) : undefined;
    ad.ParkingAdditionally ? parkingAdditionally.value = normalizeValuesInArray(parkingAdditionally_) : undefined;
    ad.BathroomMulti ? bathroomMulti.value = normalizeValuesInArray(bathroomMulti_) : undefined;
    ad.Parking ? parking.value = normalizeValuesInArray(parking_) : undefined;
    
    ad.WallsType ? WallsType.value = wallsType_ : undefined;
    ad.ObjectType ? ObjectType.value = objectType_ : undefined;
    ad.LandArea ? LandArea.value = landArea_ : undefined;

    console.log('getAdditionalInfoById', ad.WallsType, ad.ObjectType, ad.LandArea);
  }
}

function normalizeValuesInArray(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = [value];
    return acc;
  }, {});
}

// Отключение всех чекбоксов кроме выбраного
watch(parking, (newVal) => {
  const selectedKey = Object.keys(newVal).find(key => newVal[key][0]);
  selectedParking.value = selectedKey ? selectedKey : 0;
  selectedParking.fill = !!selectedKey;
}, { deep: true });

const isDisabled = (key) => {
  if (selectedParking.fill && selectedParking.value !== key) {
    return true;
  }
  return false;
};

const formatLabel = (key) => {
  const labels = {
    AirConditioning: 'Кондиционер',
    Refrigerator: 'Холодильник',
    Stove: 'Плита',
    Microwave: 'Микроволновка',
    WashingMachine: 'Стиральная машина',
    Dishwasher: 'Посудомоечная машина',
    WaterHeater: 'Водонагреватель',
    TV: 'Телевизор',
    Iron: 'Утюг',
    Hairdryer: 'Фен',
    Beds: "Спальные места",
    Cabinets: "Шкафы",
    Kitchen: "Кухня",
    Wifi: "wifi",
    Fireplace: "Камин",
    BalconyLoggia: "Балкон/Лоджия",
    Parking: "Парковка",
    Free: "Бесплатная",
    ForTrucks: "Для грузового транспорта",
    Combined: "Совмещенный",
    Separate: "Раздельный",
    Underground: "Подземная",
    GroundLevelMultilevel: "Наземная многоуровневая",
    OpenYard: "Во дворе",
    BehindBarrierYard: "За барьером во дворе",
  };
  return labels[key] || key;
};
</script>

<style scoped>
.card {
  padding: 10px;
}

.flex {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>