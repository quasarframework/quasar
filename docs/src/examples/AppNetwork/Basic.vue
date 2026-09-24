<template>
  <div class="q-pa-md">
    <div>
      Toggle your network connection (or throttle it from the browser's
      DevTools) to see the values change.
    </div>

    <q-markup-table class="q-mt-md" flat bordered>
      <tbody>
        <tr>
          <td>online</td>
          <td>{{ $q.network.online }}</td>
        </tr>
        <tr>
          <td>hasConnectionInfo</td>
          <td>{{ $q.network.hasConnectionInfo }}</td>
        </tr>
        <tr>
          <td>effectiveType</td>
          <td>{{
            $q.network.effectiveType ?? 'not exposed by this browser'
          }}</td>
        </tr>
        <tr>
          <td>downlink</td>
          <td>{{ $q.network.downlink ?? 'not exposed by this browser' }}</td>
        </tr>
        <tr>
          <td>rtt</td>
          <td>{{ $q.network.rtt ?? 'not exposed by this browser' }}</td>
        </tr>
        <tr>
          <td>saveData</td>
          <td>{{ $q.network.saveData ?? 'not exposed by this browser' }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table v-if="eventList.length > 0" class="q-mt-md" flat bordered>
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
  () => $q.network.online,
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
      label: state ? 'Back online' : 'Went offline'
    })
  }
)
</script>
