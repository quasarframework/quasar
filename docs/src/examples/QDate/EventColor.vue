<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        :events="events"
        :event-color="(date) => date[9] % 2 === 0 ? 'teal' : 'orange'"
      />

      <q-date
        v-model="date"
        :events="eventsFn"
        :event-color="(date) => date[9] % 2 === 0 ? 'teal' : 'orange'"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      date: ref('2019/02/01'),
      events: [ '2019/02/01', '2019/02/05', '2019/02/06', '2019/02/09', '2019/02/23' ],
      eventsFn (date) {
        if (date === '2019/02/01' ||
          date === '2019/02/05' ||
          date === '2019/02/06' ||
          date === '2019/02/09' ||
          date === '2019/02/23') {
          return true
        }
        return false
      }
    }
  }
}
</script>
