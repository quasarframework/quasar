<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ step.min }} to {{ step.max }} (0 to 45, step 5)
    </q-badge>

    <q-range
      v-model="step"
      :min="0"
      :max="45"
      :step="5"
      label
      color="deep-orange"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      step: ref({
        min: 10,
        max: 20
      })
    }
  }
}
</script>
