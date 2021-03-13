<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ snap.min }} to {{ snap.max }} (0 to 20, step 2)
    </q-badge>

    <q-range
      v-model="snap"
      :min="0"
      :max="20"
      :step="2"
      label
      snap
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      snap: ref({
        min: 2,
        max: 12
      })
    }
  }
}
</script>
