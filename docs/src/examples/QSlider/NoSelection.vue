<template>
  <div class="q-px-lg q-py-md">
    <q-slider
      v-model="model"
      :min="0"
      :max="10"
      markers
      hide-selection
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(2)
    }
  }
}
</script>
