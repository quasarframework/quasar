<template>
  <div class="q-pa-md">
    <q-time
      v-model="time"
      now-btn
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      time: ref('04:56')
    }
  }
}
</script>
