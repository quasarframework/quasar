<template>
  <div class="q-pa-md">
    <q-ajax-bar
      ref="barRef"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />

    <q-btn color="primary" label="Trigger" @click="trigger" />
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'

const barRef = useTemplateRef('barRef')

// we manually trigger it (this is not needed if we
// don't skip Ajax calls hijacking)
function trigger() {
  barRef.value.start()

  setTimeout(
    () => {
      barRef.value?.stop()
    },
    Math.random() * 3000 + 1000
  )
}
</script>
