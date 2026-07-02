<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        :events="events"
        :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'orange')"
      />

      <q-date
        v-model="date"
        :events="eventsFn"
        :event-color="date => (date[9] % 2 === 0 ? 'teal' : 'orange')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
const events = [
  // #region
  '2019/02/01',
  '2019/02/05',
  '2019/02/06',
  '2019/02/09',
  '2019/02/23'
  // #endregion
]

function eventsFn(d) {
  return (
    d === '2019/02/01' ||
    d === '2019/02/05' ||
    d === '2019/02/06' ||
    d === '2019/02/09' ||
    d === '2019/02/23'
  )
}
</script>
