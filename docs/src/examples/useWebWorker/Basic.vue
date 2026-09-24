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
        label="postMessage()"
        no-caps
        :disable="workerStatus === 'terminated'"
        @click="postMessage({ count })"
      />
      <q-btn
        color="negative"
        label="terminate()"
        no-caps
        :disable="workerStatus !== 'running'"
        @click="terminate"
      />
    </div>

    <div v-if="workerStatus === 'terminated'" class="text-negative"
      >Worker terminated</div
    >
    <div v-else-if="workerStatus === 'idle'"
      >Worker not started yet (it starts at the first postMessage)</div
    >
    <div v-else-if="data === null">No message received yet</div>
    <div v-else>
      Largest prime among the first {{ data.count }}:
      {{ data.largest }} (computed in {{ data.ms }}ms)
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebWorker } from 'quasar'

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

const { workerStatus, data, postMessage, terminate } = useWebWorker(
  () =>
    new Worker(
      URL.createObjectURL(new Blob([script], { type: 'text/javascript' }))
    )
)
</script>
