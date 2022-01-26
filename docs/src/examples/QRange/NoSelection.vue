<template>
  <div class="q-px-lg q-py-md">
    <q-range
      v-model="model"
      :min="0"
      :max="10"
      markers
      selection-color="transparent"
    />

    <q-range
      v-model="model"
      :min="0"
      :max="10"
      track-color="orange"
      inner-track-color="transparent"
      selection-color="transparent"
      markers
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 2,
        max: 6
      })
    }
  }
}
</script>
