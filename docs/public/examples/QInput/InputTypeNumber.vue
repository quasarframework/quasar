<template>
  <div class="q-pa-md">
    <q-input
      v-model.number="model"
      type="number"
      filled
      style="max-width: 200px"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(10)
    }
  }
}
</script>
