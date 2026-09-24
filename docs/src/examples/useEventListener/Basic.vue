<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm q-mb-md">
      <q-toggle v-model="listening" label="Listen to keydown on the document" />
    </div>

    <div class="q-gutter-sm row items-center">
      <div>Press any key:</div>
      <q-badge :label="`last key: ${lastKey}`" />
      <q-badge color="secondary" :label="`count: ${count}`" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEventListener } from 'quasar'

const listening = ref(true)
const lastKey = ref('none')
const count = ref(0)

// a getter, so that the server-side of SSR/SSG never evaluates `document`
useEventListener(
  () => document,
  'keydown',
  evt => {
    lastKey.value = evt.key
    count.value++
  },
  () => ({ disabled: !listening.value })
)
</script>
