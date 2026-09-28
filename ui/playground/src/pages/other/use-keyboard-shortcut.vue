<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">window shortcuts, reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-input
            ref="search"
            v-model="search"
            outlined
            dense
            label="Mod+K focuses, Escape blurs"
            style="width: 260px"
          />
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="repeat" label="repeat (arrows)" />
          <q-toggle v-model="ignoreInputs" label="ignoreInputs" />
          <q-btn
            flat
            color="negative"
            label="stopKeyboardShortcut() (Mod+K)"
            @click="stopKeyboardShortcut"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge color="primary" :label="`counter (+ / -): ${counter}`" />
          <q-badge
            color="secondary"
            :label="`arrows (ArrowUp / ArrowDown): ${arrows}`"
          />
          <q-badge
            :color="help ? 'positive' : 'grey'"
            :label="`help (?): ${help}`"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="binding"
            outlined
            dense
            label="reactive binding"
            style="width: 200px"
          />
          <q-badge color="orange" :label="`fired: ${bindingHits}`" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle2">last matches</div>
        <div v-if="log.length === 0" class="text-grey">none yet</div>
        <div v-for="entry in log" :key="entry.id">
          {{ entry.at }}: {{ entry.shortcut }} ({{ entry.type }} on
          {{ entry.target }})
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">scoped target, keyup</div>
        <div>Focus the textarea and press Ctrl+Enter (fires on keyup).</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          ref="area"
          v-model="text"
          type="textarea"
          outlined
          label="Ctrl+Enter submits"
        />
        <q-badge
          class="q-mt-sm"
          color="accent"
          :label="`submitted: ${submitted}`"
        />
      </q-card-section>
    </q-card>

    <div v-for="n in 30" :key="n" class="q-pa-sm">Page filler #{{ n }}</div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useKeyboardShortcut } from 'quasar'

const searchRef = useTemplateRef('search')
const areaRef = useTemplateRef('area')

const search = ref('')
const text = ref('')
const disabled = ref(false)
const repeat = ref(false)
const ignoreInputs = ref(true)
const binding = ref('Mod+Shift+L')

const counter = ref(0)
const arrows = ref(0)
const help = ref(false)
const bindingHits = ref(0)
const submitted = ref(0)

const log = ref([])
let logId = 0

function record(evt, shortcut) {
  log.value.unshift({
    id: logId++,
    at: new Date().toLocaleTimeString(),
    shortcut,
    type: evt.type,
    target: evt.target === window ? 'window' : evt.target.tagName
  })
  if (log.value.length > 10) {
    log.value.pop()
  }
}

const options = () => ({
  disabled: disabled.value,
  ignoreInputs: ignoreInputs.value
})

const { stopKeyboardShortcut } = useKeyboardShortcut(
  'Mod+K',
  (evt, shortcut) => {
    record(evt, shortcut)
    searchRef.value.focus()
  },
  options
)

useKeyboardShortcut(
  'Escape',
  (evt, shortcut) => {
    record(evt, shortcut)
    searchRef.value.blur()
  },
  options
)

useKeyboardShortcut(
  ['+', '-'],
  (evt, shortcut) => {
    record(evt, shortcut)
    counter.value += shortcut === '+' ? 1 : -1
  },
  options
)

useKeyboardShortcut(
  ['ArrowUp', 'ArrowDown'],
  (evt, shortcut) => {
    record(evt, shortcut)
    arrows.value += shortcut === 'ArrowUp' ? 1 : -1
  },
  () => ({ ...options(), repeat: repeat.value })
)

useKeyboardShortcut(
  '?',
  (evt, shortcut) => {
    record(evt, shortcut)
    help.value = !help.value
  },
  options
)

useKeyboardShortcut(
  binding,
  (evt, shortcut) => {
    record(evt, shortcut)
    bindingHits.value++
  },
  options
)

useKeyboardShortcut(
  'Ctrl+Enter',
  (evt, shortcut) => {
    record(evt, shortcut)
    submitted.value++
  },
  { target: areaRef, keyup: true }
)
</script>
