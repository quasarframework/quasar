<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <div>{{ exampleStore.greeting }}</div>
      <JsxGreeting text="Greetings from JSX" />
      <q-btn color="primary" to="/second" label="Go to Second Page" no-caps />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// the button label, the rendered store greeting and the TSX component's
// text are asserted by the e2e suites; keep them in sync with
// /app-vite/test/playground-suite.js > fixtureMarkers
import JsxGreeting from '@/components/JsxGreeting'
import { useExampleStore } from '@/stores/example-store'

const exampleStore = useExampleStore()
</script>
