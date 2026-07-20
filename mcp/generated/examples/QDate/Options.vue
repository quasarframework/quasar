<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" :options="options" />

      <q-date v-model="date" :options="optionsFn" />

      <q-date v-model="date" :options="optionsFn2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')

const options = [
  // #region
  '2019/02/01',
  '2019/02/05',
  '2019/02/06',
  '2019/02/09',
  '2019/02/23'
  // #endregion
]

function optionsFn(d) {
  return d >= '2019/02/03' && d <= '2019/02/15'
}

function optionsFn2(d) {
  const parts = d.split('/')
  return parts[2] % 2 === 0
}
</script>
