<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn
        color="primary"
        label="Run for 1s (timeout: 3s)"
        no-caps
        :disable="workerFnStatus === 'running'"
        @click="run(1000)"
      />
      <q-btn
        color="orange"
        label="Run for 10s (times out)"
        no-caps
        :disable="workerFnStatus === 'running'"
        @click="run(10000)"
      />
      <q-btn
        v-if="workerFnStatus !== 'idle' && workerFnStatus !== 'timeout'"
        color="negative"
        label="terminateWorkerFn()"
        no-caps
        @click="terminateWorkerFn"
      />
    </div>

    <div class="row items-center q-gutter-sm">
      <q-badge :label="workerFnStatus" color="secondary" />
      <div>{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebWorkerFn } from 'quasar'

const { workerFnStatus, runWorkerFn, terminateWorkerFn } = useWebWorkerFn(
  async ms => {
    await new Promise(resolve => {
      setTimeout(resolve, ms)
    })
    return `${ms}ms of work done`
  },
  { timeout: 3000 }
)

const message = ref('')

async function run(ms) {
  message.value = 'running...'
  try {
    message.value = await runWorkerFn(ms)
  } catch (err) {
    message.value = err.message
  }
}
</script>
