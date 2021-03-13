<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ rangeSnap.min }} to {{ rangeSnap.max }} (0 to 100, step 5)
    </q-badge>

    <q-range
      v-model="rangeSnap"
      :min="0"
      :max="100"
      :step="5"
      drag-range
      label
      markers
      snap
      color="lime"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      rangeSnap: ref({
        min: 35,
        max: 60
      })
    }
  }
}
</script>
