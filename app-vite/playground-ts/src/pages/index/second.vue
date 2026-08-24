<template>
  <q-page class="flex flex-center">
    <div class="column items-center second-page-style">
      <SharedStyleBadge />
      <q-btn color="secondary" to="/" label="Go to Index Page" no-caps />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SharedStyleBadge from '@/components/SharedStyleBadge'
</script>

<style scoped>
/* the page's own CSS, asserted to load AFTER the CSS of the chunk shared
   with the catch-all page; keep the class in sync with
   /app-vite/test/playground-suite.js > fixtureMarkers */
.second-page-style {
  gap: 4px;
}
</style>
