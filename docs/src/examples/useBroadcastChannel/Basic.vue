<template>
  <div class="q-pa-md">
    <q-input
      v-model="draft"
      outlined
      dense
      label="Message for the other tabs"
      @keyup.enter="send"
    >
      <template #append>
        <q-btn
          flat
          round
          icon="send"
          :disable="draft.length === 0"
          @click="send"
        />
      </template>
    </q-input>

    <div class="q-mt-md">
      <div v-if="received.length === 0" class="text-grey">
        Nothing received yet. Post a message from another tab of this page.
      </div>
      <q-chat-message
        v-for="entry in received"
        :key="entry.id"
        :text="[entry.text]"
        :stamp="entry.stamp"
        name="Another tab"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBroadcastChannel } from 'quasar'

const draft = ref('')
const received = ref([])

const { postMessage } = useBroadcastChannel('quasar-docs-example', {
  onMessage(data) {
    received.value.push({
      id: Date.now(),
      text: data.text,
      stamp: new Date(data.sentAt).toLocaleTimeString()
    })
  }
})

function send() {
  if (draft.value.length === 0) return

  postMessage({ text: draft.value, sentAt: Date.now() })
  draft.value = ''
}
</script>
