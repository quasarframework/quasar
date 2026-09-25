<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">wikimedia recent changes, auto open</div>
        <div class="row q-gutter-sm items-center">
          <q-btn color="positive" label="openSource()" @click="openSource" />
          <q-btn
            color="negative"
            label="closeSource()"
            flat
            @click="closeSource"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>sourceStatus: {{ sourceStatus }}</div>
        <div>sourceLastEventId: {{ sourceLastEventId }}</div>
        <div>
          sourceError: {{ sourceError === null ? 'null' : sourceError.type }}
        </div>
        <div>onOpen calls: {{ opens }}</div>
        <div>onMessage calls: {{ messages }}</div>
        <div>onClose calls: {{ closes }}</div>
        <div>onReconnect: {{ reconnects }}</div>
        <div class="ellipsis">sourceData: {{ sourceData }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive URL, lazy, 2 retries</div>
        <div class="row q-gutter-sm items-center">
          <q-select
            v-model="stream"
            dense
            outlined
            :options="['recentchange', 'revision-create', 'page-delete']"
            style="width: 220px"
          />
          <q-btn
            color="positive"
            label="openSource()"
            @click="reactive.openSource"
          />
          <q-btn
            color="negative"
            label="closeSource()"
            flat
            @click="reactive.closeSource"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>url: {{ streamUrl }}</div>
        <div>sourceStatus: {{ reactive.sourceStatus.value }}</div>
        <div class="ellipsis">sourceData: {{ reactive.sourceData.value }}</div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">
          not an event stream (404), autoReconnect: { retries: 3 }
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div>sourceStatus: {{ failing.sourceStatus.value }}</div>
        <div>
          sourceError:
          {{
            failing.sourceError.value === null
              ? 'null'
              : failing.sourceError.value.type
          }}
        </div>
        <div>onReconnect: {{ failingReconnects }}</div>
        <div>onClose: {{ failingCloses }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEventSource } from 'quasar'

const opens = ref(0)
const messages = ref(0)
const closes = ref([])
const reconnects = ref([])

const {
  sourceStatus,
  sourceData,
  sourceLastEventId,
  sourceError,
  openSource,
  closeSource
} = useEventSource('https://stream.wikimedia.org/v2/stream/recentchange', {
  onOpen() {
    opens.value++
  },
  onMessage() {
    messages.value++
  },
  onClose(reason) {
    closes.value.push(reason)
  },
  onReconnect(attempt, delay) {
    reconnects.value.push(`#${attempt} in ${delay}ms`)
  }
})

const stream = ref('recentchange')
const streamUrl = computed(
  () => `https://stream.wikimedia.org/v2/stream/${stream.value}`
)

const reactive = useEventSource(streamUrl, {
  lazy: true,
  autoReconnect: { retries: 2, delay: 1000 }
})

const failingReconnects = ref([])
const failingCloses = ref([])

const failing = useEventSource('/nothing-listens-here', {
  autoReconnect: { retries: 3, delay: 2000 },
  onReconnect(attempt, delay) {
    failingReconnects.value.push(`#${attempt} in ${delay}ms`)
  },
  onClose(reason) {
    failingCloses.value.push(reason)
  }
})
</script>
