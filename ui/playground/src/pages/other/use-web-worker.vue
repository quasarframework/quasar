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
            label="postMessage({ count })"
            @click="postMessage({ count })"
          />
          <q-btn
            color="negative"
            label="terminate()"
            flat
            :disable="workerStatus !== 'running'"
            @click="terminate"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>workerStatus: {{ workerStatus }}</div>
        <div>data: {{ data }}</div>
        <div>error: {{ error === null ? 'null' : error.message }}</div>
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
        <div class="text-h6">failing script, eager (error + onError)</div>
        <div
          >error:
          {{ failing.error === null ? 'null' : failing.error.message }}</div
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

const { workerStatus, data, error, postMessage, terminate } = useWebWorker(
  () =>
    new Worker(new URL('use-web-worker.worker.js', import.meta.url), {
      type: 'module'
    }),
  {
    onMessage() {
      messages.value++
    }
  }
)

const bufferInfo = ref('')

function postBuffer() {
  const buffer = new ArrayBuffer(16 * 1024 * 1024)
  postMessage({ buffer }, [buffer])
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
    eager: true,
    onError(evt) {
      failingCalls.value++
      evt.preventDefault()
    }
  }
)
</script>
