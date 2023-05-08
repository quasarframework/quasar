<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ onlyRange.min }} to {{ onlyRange.max }} (0 to 100, step 5)
    </q-badge>

    <q-range
      v-model="onlyRange"
      :min="0"
      :max="100"
      :step="5"
      drag-only-range
      label
      color="info"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      onlyRange: ref({
        min: 10,
        max: 35
      })
    }
  }
}
</script>
