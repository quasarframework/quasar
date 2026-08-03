<template>
  <div class="q-layout-padding">
    <div class="row q-gutter-md q-pb-md">
      <q-btn label="Null model" @click="nullify" />
      <q-btn label="Reset" @click="reset" />
      <q-toggle v-model="noUnset" label="No unset" />
    </div>

    <div class="q-gutter-md">
      <div>Single {{ day || 'none ' }}:</div>
      <q-date
        v-model="day"
        today-btn
        @update:model-value="onInput"
        :no-unset="noUnset"
      />

      <div>Multiple {{ days || 'none ' }}:</div>
      <q-date
        v-model="days"
        multiple
        today-btn
        @update:model-value="onInput"
        :no-unset="noUnset"
      />

      <div>Range {{ dayRange || 'none ' }}:</div>
      <q-date
        v-model="dayRange"
        today-btn
        range
        @update:model-value="onInput"
        @range-start="onRangeStart"
        @range-end="onRangeEnd"
        :no-unset="noUnset"
      />

      <div>Multiple + Range {{ daysRange || 'none ' }}:</div>
      <div class="row no-wrap">
        <q-date
          ref="daysRangeRef"
          v-model="daysRange"
          multiple
          today-btn
          range
          @update:model-value="onInput"
          @range-start="onRangeStart"
          @range-end="onRangeEnd"
          :no-unset="noUnset"
        />
        <div class="q-gutter-sm q-ml-sm">
          <q-btn label="setEditingRange(from)" @click="setRangeFrom" no-caps />
          <q-btn
            label="setEditingRange(from, to)"
            @click="setRangeFromTo"
            no-caps
          />
          <q-btn label="setEditingRange()" @click="setRangeNull" no-caps />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* oxlint-disable */

import { ref } from 'vue'

const noUnset = ref(false)

const day = ref('2020/07/02')
const days = ref([
  '2020/08/02',
  '2020/08/10'
  // '2021/09/11',
])
const dayRange = ref({ from: '2020/07/08', to: '2020/07/17' })
const daysRange = ref([
  { from: '2020/08/12', to: '2020/08/16' },
  '2020/08/02',
  '2020/08/10',
  { from: '2020/08/27', to: '2020/09/15' }
  // '2021/09/11',
])

const daysRangeRef = ref(null)

function nullify() {
  day.value = null
  days.value = null
  dayRange.value = null
  daysRange.value = null
}

function reset() {
  day.value = '2020/07/02'
  days.value = [
    '2020/08/02',
    '2020/08/10'
    // '2021/09/11',
  ]
  dayRange.value = { from: '2020/07/08', to: '2020/07/17' }
  daysRange.value = [
    '2020/08/02',
    '2020/08/10',
    { from: '2020/08/12', to: '2020/08/16' },
    { from: '2020/08/27', to: '2020/09/15' }
    // '2021/09/11',
  ]
}

function onInput(value, reason, details) {
  console.log('@update:model-value:', value, reason, details)
}

function onRangeStart(payload) {
  console.log('@range-start', payload)
}

function onRangeEnd(payload) {
  console.log('@range-end', payload)
}

function setRangeFrom() {
  daysRangeRef.value.setEditingRange({ year: 2020, month: 8, day: 4 })
}

function setRangeFromTo() {
  daysRangeRef.value.setEditingRange(
    { year: 2020, month: 8, day: 4 },
    { year: 2020, month: 8, day: 6 }
  )
}

function setRangeNull() {
  daysRangeRef.value.setEditingRange()
}
</script>
