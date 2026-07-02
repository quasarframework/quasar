<template>
  <div class="q-pa-md">
    <div>
      Switch to another browser tab or app then come back here to see some
      changes.
    </div>

    <q-markup-table v-if="eventList.length > 0" class="q-mt-md">
      <tbody>
        <tr v-for="evt in eventList" :key="evt.timestamp">
          <td>{{ evt.timestamp }}</td>
          <td>{{ evt.label }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'

function pad(number) {
  return (number < 10 ? '0' : '') + number
}

const $q = useQuasar()
const eventList = ref([])

watch(
  () => $q.appVisible,
  state => {
    const date = new Date()
    eventList.value.unshift({
      timestamp:
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds()) +
        '.' +
        date.getMilliseconds(),
      label: `App became ${state ? 'visible' : 'hidden'}`
    })
  }
)
</script>
