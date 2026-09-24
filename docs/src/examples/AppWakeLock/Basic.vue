<template>
  <div class="q-pa-md">
    <div v-if="$q.wakeLock.isCapable">
      <q-toggle
        v-model="keepAwake"
        label="Keep the screen awake"
        @update:model-value="onToggle"
      />

      <div class="q-mt-sm"> Lock held: {{ $q.wakeLock.isActive }} </div>

      <div class="q-mt-sm text-caption">
        Switch to another tab or app and come back: the browser drops the lock
        while the page is hidden and the plugin re-acquires it.
      </div>
    </div>

    <div v-else> This browser does not support the Screen Wake Lock API. </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'

const $q = useQuasar()
const keepAwake = ref(false)

function onToggle(val) {
  const promise = val ? $q.wakeLock.request() : $q.wakeLock.release()

  promise.catch(err => {
    keepAwake.value = false
    $q.notify({
      type: 'negative',
      message: `Wake lock ${val ? 'request' : 'release'} failed: ${err.message}`
    })
  })
}

// the plugin keeps re-acquiring the lock until release() is called,
// so this is only a mirror of what the toggle asked for
watch(
  () => $q.wakeLock.isActive,
  val => {
    if (val) keepAwake.value = true
  }
)
</script>
