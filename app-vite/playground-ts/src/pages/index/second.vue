<template>
  <q-page class="flex flex-center">
    <div class="column items-center second-page-style">
      <SharedStyleBadge />
      <q-btn
        ref="indexBtn"
        color="secondary"
        to="/"
        label="Go to Index Page"
        no-caps
      />
      <div v-touch-pan.horizontal.prevent="onPan" v-resize:100="onResize" />
      <!-- @vue-expect-error unknown directive modifier -->
      <div v-touch-pan.typo="onPan" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// the directive usages and the template ref above are asserted by the
// e2e typecheck step
import { useTemplateRef } from 'vue'

import SharedStyleBadge from '@/components/SharedStyleBadge'

const indexBtn = useTemplateRef('indexBtn')

function onPan() {}
function onResize() {
  indexBtn.value?.$el.classList.contains('q-btn')
}
</script>

<style scoped>
/* the page's own CSS, asserted to load AFTER the CSS of the chunk shared
   with the catch-all page; keep the class in sync with
   /app-vite/test/playground-suite.js > fixtureMarkers */
.second-page-style {
  gap: 4px;
}
</style>
