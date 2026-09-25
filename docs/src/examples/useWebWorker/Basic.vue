<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-input
        v-model.number="count"
        type="number"
        dense
        outlined
        label="Primes to find"
        style="width: 160px"
      />
      <q-btn
        color="primary"
        label="postWorkerMessage()"
        no-caps
        @click="postWorkerMessage({ count })"
      />
      <q-btn
        v-if="workerStatus === 'running'"
        color="negative"
        label="terminateWorker()"
        no-caps
        @click="terminateWorker"
      />
    </div>

    <div v-if="workerStatus === 'idle'"
      >No worker running (the next postWorkerMessage creates one)</div
    >
    <div v-else-if="workerData === null">No message received yet</div>
    <div v-else>
      Largest prime among the first {{ workerData.count }}:
      {{ workerData.largest }} (computed in {{ workerData.ms }}ms)
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useObjectUrl, useWebWorker } from 'quasar'

// In your app the worker lives in its own file:
//   () => new Worker(new URL('./primes.js', import.meta.url), { type: 'module' })
// The example inlines the script so that it fits in one file.
const script = `
onmessage = ({ data }) => {
  const start = performance.now()
  const primes = []
  for (let n = 2; primes.length < data.count; n++) {
    if (primes.every(p => n % p !== 0)) primes.push(n)
  }
  postMessage({
    count: data.count,
    largest: primes[primes.length - 1],
    ms: Math.round(performance.now() - start)
  })
}`

const count = ref(2000)

// revoked when the component gets destroyed
const { objectUrl } = useObjectUrl(
  new Blob([script], { type: 'text/javascript' })
)

const { workerStatus, workerData, postWorkerMessage, terminateWorker } =
  useWebWorker(() => new Worker(objectUrl.value), { lazy: true })
</script>
