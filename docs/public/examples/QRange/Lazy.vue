<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ lazy.min }} to {{ lazy.max }} (0 to 50, step 1)
    </q-badge>

    <q-range
      :model-value="lazy"
      @change="val => { lazy = val }"
      :min="0"
      :max="50"
      label
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      lazy: ref({
        min: 10,
        max: 35
      })
    }
  }
}
</script>
