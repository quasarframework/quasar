<template>
  <div class="q-pa-md">
    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      :label-value="'Value: ' + value + 'px'"
      label-always
      color="purple"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(-10)
    }
  }
}
</script>
