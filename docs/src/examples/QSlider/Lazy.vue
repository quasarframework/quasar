<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ lazy }}
    </q-badge>

    <q-slider
      :model-value="lazy"
      @change="val => { lazy = val }"
      :min="0"
      :max="45"
      :step="5"
      color="purple"
      label
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      lazy: ref(6)
    }
  }
}
</script>
