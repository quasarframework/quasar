<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">default events, reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-btn-toggle
            v-model="timeout"
            :options="[
              { label: '2s', value: 2000 },
              { label: '5s', value: 5000 },
              { label: '10s', value: 10000 }
            ]"
          />
          <q-toggle v-model="disabled" label="disabled" />
          <q-btn flat color="primary" label="resetIdle()" @click="resetIdle" />
          <q-btn flat color="negative" label="stopIdle()" @click="stopIdle" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge
            :color="isIdle ? 'orange' : 'positive'"
            :label="isIdle ? 'idle' : 'active'"
          />
          <q-badge
            v-if="lastActive !== 0"
            color="secondary"
            :label="`lastActive: ${lastActive}`"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2">onIdle() transitions</div>
        <div v-if="log.length === 0" class="text-grey">none yet</div>
        <div v-for="entry in log" :key="entry.id">
          {{ entry.at }}: {{ entry.state }}
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">"events" option: click only, 3s</div>
        <div>Moving the mouse does not count here; click anywhere.</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-badge
          :color="clickIdle ? 'orange' : 'positive'"
          :label="clickIdle ? 'idle' : 'active'"
        />
      </q-card-section>
    </q-card>

    <div v-for="n in 30" :key="n" class="q-pa-sm">Page filler #{{ n }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useIdle } from 'quasar'

const timeout = ref(5000)
const disabled = ref(false)

const log = ref([])
let logId = 0

const { isIdle, lastActive, resetIdle, stopIdle } = useIdle(() => ({
  timeout: timeout.value,
  disabled: disabled.value,
  onIdle
}))

function onIdle(idle) {
  log.value.unshift({
    id: logId++,
    at: new Date().toLocaleTimeString(),
    state: idle ? 'idle' : 'active'
  })
  if (log.value.length > 10) {
    log.value.pop()
  }
}

const { isIdle: clickIdle } = useIdle({
  timeout: 3000,
  events: ['click']
})
</script>
