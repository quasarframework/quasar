<template>
  <div class="q-layout-padding q-gutter-md">
    <div class="text-caption">
      open this page in a second tab; every channel below is cross-tab
    </div>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">channel "playground", auto open</div>
        <div class="row q-gutter-sm items-center">
          <q-input v-model="text" dense outlined label="text" />
          <q-btn color="primary" label="postMessage(text)" @click="sendText" />
          <q-btn
            color="primary"
            label="postMessage(object)"
            @click="sendObject"
          />
          <q-btn
            color="negative"
            flat
            label="closeChannel()"
            @click="closeChannel"
          />
          <q-btn
            color="positive"
            flat
            label="connectChannel()"
            @click="connectChannel"
          />
          <q-btn flat label="post a function (throws)" @click="sendFunction" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>channelStatus: {{ channelStatus }}</div>
        <div>onMessage calls: {{ messages }}</div>
        <div>error: {{ error === null ? 'null' : error.type }}</div>
        <div>thrown: {{ thrown }}</div>
        <div class="ellipsis">data: {{ JSON.stringify(data) }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive name, manualConnect</div>
        <div class="row q-gutter-sm items-center">
          <q-select
            v-model="room"
            dense
            outlined
            :options="['room-a', 'room-b', 'room-c']"
            style="width: 160px"
          />
          <q-btn
            color="positive"
            label="connectChannel()"
            @click="reactive.connectChannel"
          />
          <q-btn
            color="negative"
            flat
            label="closeChannel()"
            @click="reactive.closeChannel"
          />
          <q-btn
            color="primary"
            :label="`postMessage() on ${room}`"
            @click="reactive.postMessage(`hello from ${room}`)"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>channelStatus: {{ reactive.channelStatus.value }}</div>
        <div>data: {{ reactive.data.value }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBroadcastChannel } from 'quasar'

const text = ref('hi')
const messages = ref(0)
const thrown = ref('none')

const {
  channelStatus,
  data,
  error,
  postMessage,
  connectChannel,
  closeChannel
} = useBroadcastChannel('playground', {
  onMessage() {
    messages.value++
  }
})

function sendText() {
  postMessage(text.value)
}

function sendObject() {
  postMessage({ text: text.value, at: new Date(), list: [1, 2, 3] })
}

function sendFunction() {
  try {
    postMessage(() => {})
    thrown.value = 'nothing'
  } catch (err) {
    thrown.value = err.name
  }
}

const room = ref('room-a')
const reactive = useBroadcastChannel(room, { manualConnect: true })
</script>
