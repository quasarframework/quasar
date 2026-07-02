<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time1"
        :hour-options="hourOptionsTime1"
        :minute-options="minuteOptionsTime1"
        :second-options="secondOptionsTime1"
        with-seconds
      />

      <q-time v-model="time2" :options="optionsFnTime2" with-seconds />

      <q-time v-model="time3" :options="optionsFnTime3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref('10:45:40')
const time2 = ref('14:27:20')
const time3 = ref('10:56')

const hourOptionsTime1 = [9, 10, 11, 13, 15]
const minuteOptionsTime1 = [0, 15, 30, 45]
const secondOptionsTime1 = [0, 10, 20, 30, 40, 50]

function optionsFnTime2(hr, min, sec) {
  if (hr < 6 || hr > 15 || hr % 2 !== 0) {
    return false
  }
  if (min !== null && (min <= 25 || min >= 58)) {
    return false
  }
  if (sec !== null && sec % 25 !== 0) {
    return false
  }
  return true
}

function optionsFnTime3(hr) {
  return hr % 2 === 0 || hr % 3 === 0
}
</script>
