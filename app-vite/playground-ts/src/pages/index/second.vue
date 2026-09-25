<template>
  <q-page class="flex flex-center">
    <div class="column items-center second-page-style">
      <SharedStyleBadge />
      <q-btn color="secondary" to="/" label="Go to Index Page" no-caps />
      <div v-touch-pan.horizontal.prevent="onPan" v-resize:100="onResize" />
      <!-- @vue-expect-error unknown directive modifier -->
      <div v-touch-pan.typo="onPan" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// the directive usages above are asserted by the e2e typecheck step
import SharedStyleBadge from '@/components/SharedStyleBadge'

function onPan() {}
function onResize() {}
</script>

<style scoped>
/* the page's own CSS, asserted to load AFTER the CSS of the chunk shared
   with the catch-all page; keep the class in sync with
   /app-vite/test/playground-suite.js > fixtureMarkers */
.second-page-style {
  gap: 4px;
}
</style>
