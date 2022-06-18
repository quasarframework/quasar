<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      :step="10"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="lime"
      track-color="lime-3"
      class="text-lime q-ma-md"
    />

    <q-knob
      :step="25"
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="orange"
      track-color="orange-3"
      class="text-orange q-ma-md"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(61)
    }
  }
}
</script>
