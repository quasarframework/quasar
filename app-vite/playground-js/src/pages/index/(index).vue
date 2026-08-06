<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <q-btn color="primary" to="/second" label="Go to Second Page" no-caps />
    </div>
  </q-page>
</template>

<script setup>
// the button label is asserted by the e2e suites — keep it in sync
// with /app-vite/test/playground-suite.js > fixtureMarkers
</script>
