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
          <q-btn
            color="primary"
            label="postChannelMessage(text)"
            @click="sendText"
          />
          <q-btn
            color="primary"
            label="postChannelMessage(object)"
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
        <div>isChannelConnected: {{ isChannelConnected }}</div>
        <div>onConnect calls: {{ connects }}</div>
        <div>onClose calls: {{ closes }}</div>
        <div>onMessage calls: {{ messages }}</div>
        <div>
          channelError: {{ channelError === null ? 'null' : channelError.type }}
        </div>
        <div>thrown: {{ thrown }}</div>
        <div class="ellipsis"
          >channelData: {{ JSON.stringify(channelData) }}</div
        >
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive name, lazy</div>
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
            :label="`postChannelMessage() on ${room}`"
            @click="reactive.postChannelMessage(`hello from ${room}`)"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>isChannelConnected: {{ reactive.isChannelConnected.value }}</div>
        <div>channelData: {{ reactive.channelData.value }}</div>
        <div>onClose reasons: {{ reasons.join(', ') || 'none' }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBroadcastChannel } from 'quasar'

const text = ref('hi')
const messages = ref(0)
const connects = ref(0)
const closes = ref(0)
const thrown = ref('none')

const {
  isChannelConnected,
  channelData,
  channelError,
  postChannelMessage,
  connectChannel,
  closeChannel
} = useBroadcastChannel('playground', {
  onConnect() {
    connects.value++
  },
  onMessage() {
    messages.value++
  },
  onClose() {
    closes.value++
  }
})

function sendText() {
  postChannelMessage(text.value)
}

function sendObject() {
  postChannelMessage({ text: text.value, at: new Date(), list: [1, 2, 3] })
}

function sendFunction() {
  try {
    postChannelMessage(() => {})
    thrown.value = 'nothing'
  } catch (err) {
    thrown.value = err.name
  }
}

const room = ref('room-a')
const reasons = ref([])
const reactive = useBroadcastChannel(room, {
  lazy: true,
  onClose(reason) {
    reasons.value.push(reason)
  }
})
</script>
