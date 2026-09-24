<template>
  <div class="q-layout-padding">
    <p class="caption">
      Toggle the network (airplane mode, or DevTools > Network > Offline /
      throttling) to see the plugin react.
    </p>

    <pre>{{ state }}</pre>

    <table class="q-table striped" v-if="eventList.length > 0">
      <tbody>
        <tr v-for="evt in eventList" :key="evt.timestamp">
          <td>{{ evt.timestamp }}</td>
          <td>{{ evt.label }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

function pad(number) {
  return (number < 10 ? '0' : '') + number
}

const $q = useQuasar()

const state = computed(() => ({
  online: $q.network.online,
  hasConnectionInfo: $q.network.hasConnectionInfo,
  effectiveType: $q.network.effectiveType,
  downlink: $q.network.downlink,
  rtt: $q.network.rtt,
  saveData: $q.network.saveData
}))

const eventList = ref([])

watch(state, (val, oldVal) => {
  const date = new Date()
  const changes = Object.keys(val)
    .filter(key => val[key] !== oldVal[key])
    .map(key => `${key}: ${oldVal[key]} -> ${val[key]}`)

  eventList.value.unshift({
    timestamp:
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds()) +
      '.' +
      date.getMilliseconds(),
    label: changes.join(', ')
  })
})
</script>
