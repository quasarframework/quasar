<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">echo server, auto open, reconnect + heartbeat</div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="message"
            dense
            outlined
            label="message"
            style="width: 220px"
          />
          <q-btn color="primary" label="send()" @click="send(message)" />
          <q-btn
            color="positive"
            label="openSocket()"
            flat
            @click="openSocket"
          />
          <q-btn
            color="negative"
            label="closeSocket(4000, 'bye')"
            flat
            @click="closeSocket(4000, 'bye')"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>socketStatus: {{ socketStatus }}</div>
        <div>data: {{ data }}</div>
        <div>error: {{ error === null ? 'null' : error.type }}</div>
        <div>onOpen calls: {{ opens }}</div>
        <div>onMessage calls: {{ messages }}</div>
        <div>onClose calls: {{ closes }}</div>
        <div>onReconnect: {{ reconnects }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive URL, manualOpen, 2 retries</div>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="room"
            dense
            outlined
            label="room (query string)"
            style="width: 220px"
          />
          <q-btn
            color="positive"
            label="openSocket()"
            @click="reactive.openSocket"
          />
          <q-btn
            color="negative"
            label="closeSocket()"
            flat
            @click="reactive.closeSocket()"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>url: {{ roomUrl }}</div>
        <div>socketStatus: {{ reactive.socketStatus.value }}</div>
        <div>data: {{ reactive.data.value }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">unreachable server, autoReconnect: false</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>socketStatus: {{ failing.socketStatus.value }}</div>
        <div
          >error:
          {{
            failing.error.value === null ? 'null' : failing.error.value.type
          }}</div
        >
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useWebSocket } from 'quasar'

const message = ref('hello')
const opens = ref(0)
const messages = ref(0)
const closes = ref([])
const reconnects = ref([])

const { socketStatus, data, error, send, openSocket, closeSocket } =
  useWebSocket('wss://echo.websocket.org', {
    heartbeat: { message: 'heartbeat', interval: 10_000 },
    onOpen() {
      opens.value++
    },
    onMessage() {
      messages.value++
    },
    onClose(evt, reason) {
      closes.value.push(`${reason} (${evt.code})`)
    },
    onReconnect(attempt, delay) {
      reconnects.value.push(`#${attempt} in ${delay}ms`)
    }
  })

const room = ref('lobby')
const roomUrl = computed(
  () => `wss://echo.websocket.org/?room=${encodeURIComponent(room.value)}`
)

const reactive = useWebSocket(roomUrl, {
  manualOpen: true,
  autoReconnect: { retries: 2, delay: 1000 }
})

const failing = useWebSocket('ws://localhost:1/nothing-listens-here', {
  autoReconnect: false
})
</script>
