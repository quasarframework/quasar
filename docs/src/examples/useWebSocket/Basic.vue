<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-input
        v-model="message"
        dense
        outlined
        label="Message"
        style="width: 220px"
        @keyup.enter="sendMessage"
      />
      <q-btn
        color="primary"
        label="send()"
        no-caps
        :disable="message === ''"
        @click="sendMessage"
      />
      <q-btn
        v-if="socketStatus === 'closed'"
        color="positive"
        label="openSocket()"
        no-caps
        @click="openSocket"
      />
      <q-btn
        v-else
        color="negative"
        label="closeSocket()"
        no-caps
        @click="closeSocket()"
      />
    </div>

    <div class="q-mb-sm">
      Status:
      <q-badge
        :color="
          socketStatus === 'open'
            ? 'positive'
            : socketStatus === 'connecting'
              ? 'warning'
              : 'grey'
        "
        :label="socketStatus"
      />
    </div>

    <div v-if="log.length === 0">No message received yet</div>
    <div v-for="(entry, index) in log" :key="index" class="text-caption">{{
      entry
    }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWebSocket } from 'quasar'

const message = ref('Hello Quasar')
const log = ref([])

// a public echo server: it greets each connection, then repeats
// every message it receives
const { socketStatus, send, openSocket, closeSocket } = useWebSocket(
  'wss://echo.websocket.org',
  {
    onMessage(data) {
      log.value.unshift(`received: ${data}`)
    }
  }
)

function sendMessage() {
  log.value.unshift(`sent: ${message.value}`)
  send(message.value)
}
</script>
