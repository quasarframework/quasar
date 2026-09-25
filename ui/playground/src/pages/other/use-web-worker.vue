<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">bundled worker file (new URL + factory), lazy</div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model.number="count"
            type="number"
            dense
            outlined
            label="count"
            style="width: 120px"
          />
          <q-btn
            color="primary"
            label="postWorkerMessage({ count })"
            @click="postWorkerMessage({ count })"
          />
          <q-btn
            color="negative"
            label="terminateWorker()"
            flat
            :disable="workerStatus !== 'running'"
            @click="terminateWorker"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>workerStatus: {{ workerStatus }}</div>
        <div>workerData: {{ workerData }}</div>
        <div>
          workerError: {{ workerError === null ? 'null' : workerError.message }}
        </div>
        <div>onMessage calls: {{ messages }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">transfer list</div>
        <q-btn
          color="primary"
          label="post 16MB buffer (transferred)"
          @click="postBuffer"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>{{ bufferInfo }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          failing script, created on mount (workerError + onError)
        </div>
        <div
          >workerError:
          {{
            failing.workerError === null ? 'null' : failing.workerError.message
          }}</div
        >
        <div>onError calls: {{ failingCalls }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebWorker } from 'quasar'

const count = ref(1000)
const messages = ref(0)

const {
  workerStatus,
  workerData,
  workerError,
  postWorkerMessage,
  terminateWorker
} = useWebWorker(
  () =>
    new Worker(new URL('use-web-worker.worker.js', import.meta.url), {
      type: 'module'
    }),
  {
    lazy: true,
    onMessage() {
      messages.value++
    }
  }
)

const bufferInfo = ref('')

function postBuffer() {
  const buffer = new ArrayBuffer(16 * 1024 * 1024)
  postWorkerMessage({ buffer }, [buffer])
  bufferInfo.value = `byteLength on the main thread after posting: ${buffer.byteLength}`
}

const failingCalls = ref(0)

const failing = useWebWorker(
  () =>
    new Worker(
      URL.createObjectURL(
        new Blob(['throw new Error("worker boom")'], {
          type: 'text/javascript'
        })
      )
    ),
  {
    onError(evt) {
      failingCalls.value++
      evt.preventDefault()
    }
  }
)
</script>
