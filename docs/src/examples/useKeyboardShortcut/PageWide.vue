<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-input
        ref="search"
        v-model="search"
        outlined
        dense
        clearable
        placeholder="Search"
        style="width: 220px"
      >
        <template #append>
          <q-badge outline color="grey-7" :label="`${mod} F`" />
        </template>
      </q-input>

      <q-toggle v-model="disabled" label="Disable shortcuts" />
    </div>

    <div class="row items-center q-gutter-sm">
      <q-badge color="primary" :label="`counter: ${counter}`" />
      <div class="text-caption">
        Press <kbd>{{ mod }} F</kbd> to focus the search field,
        <kbd>Esc</kbd> to leave it, <kbd>?</kbd> for help and <kbd>+</kbd>/<kbd
          >-</kbd
        >
        for the counter.
      </div>
    </div>

    <q-banner v-if="showHelp" class="bg-grey-3 q-mt-md" dense rounded>
      Shortcuts: <kbd>{{ mod }} F</kbd> focus search, <kbd>Esc</kbd> blur,
      <kbd>?</kbd> toggle this help, <kbd>+</kbd> and <kbd>-</kbd> change the
      counter.
    </q-banner>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useKeyboardShortcut, useQuasar } from 'quasar'

const $q = useQuasar()
const mod = $q.platform.is.mac === true ? '⌘' : 'Ctrl'

const searchRef = useTemplateRef('search')
const search = ref('')
const disabled = ref(false)
const showHelp = ref(false)
const counter = ref(0)

const options = () => ({ disabled: disabled.value })

useKeyboardShortcut(
  'Mod+F',
  () => {
    searchRef.value.focus({ preventScroll: true })
    searchRef.value.$el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  },
  options
)
useKeyboardShortcut(
  'Escape',
  () => {
    searchRef.value.blur()
  },
  options
)
useKeyboardShortcut(
  '?',
  () => {
    showHelp.value = !showHelp.value
  },
  options
)
useKeyboardShortcut(
  ['+', '-'],
  (_, shortcut) => {
    counter.value += shortcut === '+' ? 1 : -1
  },
  options
)
</script>
