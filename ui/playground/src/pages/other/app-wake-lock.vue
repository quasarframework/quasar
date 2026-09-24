<template>
  <div class="q-layout-padding">
    <p class="caption">
      Request the lock, then switch tabs or minimize the browser and come back:
      the browser releases the lock while the page is hidden and the plugin
      re-acquires it.
    </p>

    <pre>{{ state }}</pre>

    <p>
      <q-btn
        color="secondary"
        icon="brightness_high"
        label="Toggle ($q)"
        @click="$q.wakeLock.toggle().catch(onError)"
      />
      <q-btn
        class="q-ml-sm"
        color="secondary"
        icon="brightness_high"
        label="Toggle (import)"
        @click="AppWakeLock.toggle().catch(onError)"
      />
    </p>
    <p>
      <q-btn
        color="primary"
        label="Request"
        @click="$q.wakeLock.request().catch(onError)"
      />
      <q-btn
        class="q-ml-sm"
        color="primary"
        label="Release"
        @click="$q.wakeLock.release().catch(onError)"
      />
    </p>

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
import { AppWakeLock, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

function pad(number) {
  return (number < 10 ? '0' : '') + number
}

const $q = useQuasar()

const state = computed(() => ({
  isCapable: $q.wakeLock.isCapable,
  isActive: $q.wakeLock.isActive
}))

const eventList = ref([])

function log(label) {
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
    label
  })
}

function onError(err) {
  log(`rejected: ${err.name} ${err.message}`)
}

watch(state, (val, oldVal) => {
  log(
    Object.keys(val)
      .filter(key => val[key] !== oldVal[key])
      .map(key => `${key}: ${oldVal[key]} -> ${val[key]}`)
      .join(', ')
  )
})
</script>
