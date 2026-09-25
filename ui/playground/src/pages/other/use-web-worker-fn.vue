<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">sort in a worker vs inline</div>
        <div class="row q-gutter-sm items-center">
          <q-btn
            color="primary"
            label="runWorkerFn(2M)"
            :loading="workerFnStatus === 'running'"
            @click="sortInWorker"
          />
          <q-btn color="grey-8" outline label="inline" @click="sortInline" />
          <q-btn
            color="negative"
            flat
            label="terminateWorkerFn()"
            @click="terminateWorkerFn"
          />
          <q-spinner-gears size="32px" color="primary" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>status: {{ workerFnStatus }}</div>
        <div>{{ result }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">timeout (1s), errors, concurrency</div>
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="wait 300ms" @click="wait(300)" />
          <q-btn color="orange" label="wait 5s (timeout)" @click="wait(5000)" />
          <q-btn
            color="primary"
            label="wait 300ms twice (2nd rejects)"
            @click="waitTwice"
          />
          <q-btn color="negative" label="throw" @click="wait(-1)" />
          <q-btn
            color="negative"
            label="terminate"
            flat
            @click="waitTerminate"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>status: {{ waitStatus }}</div>
        <div v-for="(entry, index) in log" :key="index">{{ entry }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">localDependencies + transfer</div>
        <q-btn
          color="primary"
          label="sum a transferred Float64Array"
          @click="sumBuffer"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>{{ sumInfo }}</div>
      </q-card-section>
    </q-card>
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

const size = 2_000_000
const result = ref('')

const { workerFnStatus, runWorkerFn, terminateWorkerFn } =
  useWebWorkerFn(medianOfRandom)

async function sortInWorker() {
  const start = performance.now()
  try {
    const median = await runWorkerFn(size)
    result.value = `worker: median ${median} in ${Math.round(performance.now() - start)}ms`
  } catch (err) {
    result.value = `worker: ${err.message}`
  }
}

function sortInline() {
  const start = performance.now()
  const median = medianOfRandom(size)
  result.value = `inline: median ${median} in ${Math.round(performance.now() - start)}ms`
}

const log = ref([])

const waitFn = useWebWorkerFn(
  async ms => {
    if (ms < 0) {
      throw new RangeError('negative duration')
    }
    await new Promise(resolve => {
      setTimeout(resolve, ms)
    })
    return `done after ${ms}ms`
  },
  { timeout: 1000 }
)

const waitStatus = waitFn.workerFnStatus

function wait(ms) {
  return waitFn.runWorkerFn(ms).then(
    value => {
      log.value.unshift(`resolved: ${value}`)
    },
    err => {
      log.value.unshift(
        `rejected (${err.constructor.name}): ${err.message ?? err}`
      )
    }
  )
}

function waitTwice() {
  wait(300)
  wait(300)
}

function waitTerminate() {
  waitFn.terminateWorkerFn()
  log.value.unshift('terminateWorkerFn() called')
}

function sumAll(view) {
  let total = 0
  for (let i = 0; i < view.length; i++) {
    total += view[i]
  }
  return total
}

const sumInfo = ref('')

const sumFn = useWebWorkerFn(buffer => sumAll(new Float64Array(buffer)), {
  localDependencies: [sumAll],
  transfer: buffer => [buffer]
})

async function sumBuffer() {
  const numbers = new Float64Array(1_000_000).fill(0.5)
  const buffer = numbers.buffer
  const total = await sumFn.runWorkerFn(buffer)
  sumInfo.value = `sum: ${total}, byteLength after transfer: ${buffer.byteLength}`
}
</script>
