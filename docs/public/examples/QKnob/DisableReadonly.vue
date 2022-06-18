<template>
  <div class="q-pa-md flex flex-center">
    <q-knob
      disable
      v-model="value"
      show-value
      size="90px"
      :thickness="0.22"
      color="primary"
      track-color="grey-3"
      class="text-primary q-ma-md"
    />

    <q-knob
      readonly
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
      value: ref(71)
    }
  }
}
</script>
