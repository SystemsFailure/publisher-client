// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

import { defineStore } from "pinia";
import { computed } from "vue";

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })

export const middleIdFurniture = defineStore('furniture', () => {
  const currId = ref('');

  const updateCurrId = value => currId.value = value;
})


export const useCounterRandomStore = defineStore('counterRandom', {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})

