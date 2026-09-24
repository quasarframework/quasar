<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">document keydown, reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="capture" label="capture" />
          <q-toggle v-model="once" label="once" />
          <q-btn flat color="negative" label="stop()" @click="stop" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge :label="`last key: ${lastKey}`" />
          <q-badge color="secondary" :label="`keydown calls: ${keydowns}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">target ref behind v-if, Array of events</div>
        <q-toggle v-model="showTarget" label="render the target" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-if="showTarget"
          ref="inputRef"
          outlined
          label="focus and blur me"
        />
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`last event: ${lastFocusEvent}`" />
          <q-badge color="secondary" :label="`calls: ${focusEvents}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive event name on window</div>
        <q-btn-toggle
          v-model="windowEvent"
          :options="[
            { label: 'resize', value: 'resize' },
            { label: 'scroll', value: 'scroll' }
          ]"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-badge :label="`${windowEvent} calls: ${windowEvents}`" />
      </q-card-section>
    </q-card>

    <div v-for="n in 30" :key="n" class="q-pa-sm">Page filler #{{ n }}</div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef, watch } from 'vue'
import { useEventListener } from 'quasar'

const inputRef = useTemplateRef('inputRef')

const disabled = ref(false)
const capture = ref(false)
const once = ref(false)
const lastKey = ref('none')
const keydowns = ref(0)

// getters: the server-side never evaluates `document` or `window`
const { stop } = useEventListener(
  () => document,
  'keydown',
  evt => {
    lastKey.value = evt.key
    keydowns.value++
  },
  () => ({
    disabled: disabled.value,
    capture: capture.value,
    once: once.value
  })
)

const showTarget = ref(true)
const lastFocusEvent = ref('none')
const focusEvents = ref(0)

// a component ref: its root element gets the listener
useEventListener(inputRef, ['focusin', 'focusout'], evt => {
  lastFocusEvent.value = evt.type
  focusEvents.value++
})

const windowEvent = ref('resize')
const windowEvents = ref(0)

useEventListener(
  () => window,
  windowEvent,
  () => {
    windowEvents.value++
  }
)

watch(windowEvent, () => {
  windowEvents.value = 0
})
</script>
