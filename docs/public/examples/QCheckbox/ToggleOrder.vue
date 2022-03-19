<template>
  <div class="q-pa-md">
    <q-btn class="q-mb-md" color="primary" label="Reset models" @click="resetModels" />

    <div class="q-gutter-sm">
      <q-checkbox v-model="teal" label="'tf' order" color="teal" />
      <q-checkbox toggle-order="ft" v-model="orange" label="'ft' order" color="orange" />
      <q-checkbox toggle-indeterminate v-model="red" label="'tf' order + toggle-indeterminate" color="red" />
      <q-checkbox toggle-indeterminate toggle-order="ft" v-model="cyan" label="'ft' order + toggle-indeterminate" color="cyan" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const teal = ref(null)
    const orange = ref(null)
    const red = ref(true)
    const cyan = ref(false)

    return {
      teal,
      orange,
      red,
      cyan,

      resetModels () {
        teal.value = null
        orange.value = null
        red.value = null
        cyan.value = null
      }
    }
  }
}
</script>
