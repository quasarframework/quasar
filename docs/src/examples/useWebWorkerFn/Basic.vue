<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn
        color="primary"
        label="Sort 2 million numbers in a worker"
        no-caps
        :loading="workerFnStatus === 'running'"
        @click="sortInWorker"
      />
      <q-btn
        color="grey-8"
        label="Sort on the main thread"
        no-caps
        outline
        @click="sortInline"
      />
    </div>

    <div class="row items-center q-gutter-sm q-mb-md">
      <q-badge :label="workerFnStatus" color="secondary" />
      <div v-if="result !== null">
        {{ result.where }}: median {{ result.median }} in {{ result.ms }}ms
      </div>
    </div>

    <q-spinner-gears size="40px" color="primary" />
    <div class="text-caption">
      The spinner keeps turning while the worker sorts, and freezes when the
      main thread does it.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebWorkerFn } from 'quasar'

function medianOfRandom(size) {
  const numbers = new Float64Array(size)
  for (let i = 0; i < size; i++) {
    numbers[i] = Math.random()
  }
  numbers.sort()
  return numbers[size >> 1].toFixed(4)
}

const { runWorkerFn, workerFnStatus } = useWebWorkerFn(medianOfRandom)

const size = 2_000_000
const result = ref(null)

async function sortInWorker() {
  const start = performance.now()
  const median = await runWorkerFn(size)
  result.value = {
    where: 'Worker',
    median,
    ms: Math.round(performance.now() - start)
  }
}

function sortInline() {
  const start = performance.now()
  const median = medianOfRandom(size)
  result.value = {
    where: 'Main thread',
    median,
    ms: Math.round(performance.now() - start)
  }
}
</script>
