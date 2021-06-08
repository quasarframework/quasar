<template>
  <div class="q-pa-md">
    <q-linear-progress :value="progress" :buffer="buffer" />

    <q-linear-progress :value="progress" :buffer="buffer" color="warning" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="secondary" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="accent" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="purple" track-color="orange" class="q-mt-sm" />

    <q-linear-progress :value="progress" :buffer="buffer" color="negative" class="q-mt-sm" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  setup () {
    const progress = ref(0.01)
    const buffer = ref(0.01)

    let interval, bufferInterval

    onMounted(() => {
      interval = setInterval(() => {
        if (progress.value >= 1) {
          progress.value = 0.01
          buffer.value = 0.01
          return
        }

        progress.value = Math.min(1, buffer.value, progress.value + 0.1)
      }, 700 + Math.random() * 1000)

      bufferInterval = setInterval(() => {
        if (buffer.value < 1) {
          buffer.value = Math.min(1, buffer.value + Math.random() * 0.2)
        }
      }, 700)
    })

    onBeforeUnmount(() => {
      clearInterval(interval)
      clearInterval(bufferInterval)
    })

    return {
      progress,
      buffer
    }
  }
}
</script>
