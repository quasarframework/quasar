<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ precision.min }} to {{ precision.max }} (0.1 to 1.5)
    </q-badge>

    <q-range
      v-model="precision"
      :min="0.1"
      :max="1.5"
      :step="0.1"
      color="green"
    />

    <q-badge color="secondary">
      Model: {{ zeroPrecision.min }} to {{ zeroPrecision.max }} (0.1 to 1.5)
    </q-badge>

    <q-range
      v-model="zeroPrecision"
      :min="0.1"
      :max="1.5"
      :step="0"
      color="amber"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      precision: ref({
        min: 0.2,
        max: 0.7
      }),

      zeroPrecision: ref({
        min: 0.2,
        max: 0.7
      })
    }
  }
}
</script>
