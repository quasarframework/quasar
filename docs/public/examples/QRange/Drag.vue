<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ range.min }} to {{ range.max }} (0 to 100, step 1)
    </q-badge>

    <q-range
      v-model="range"
      :min="0"
      :max="100"
      label
      drag-range
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      range: ref({
        min: 20,
        max: 65
      })
    }
  }
}
</script>
