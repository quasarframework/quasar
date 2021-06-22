<template>
  <div class="q-pa-md">
    <q-range
      v-model="standard"
      color="secondary"
      :min="0"
      :max="50"
      readonly
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      standard: ref({
        min: 10,
        max: 35
      })
    }
  }
}
</script>
