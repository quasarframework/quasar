<template>
  <div class="q-pa-md">
    <q-time
      v-model="time"
      format24h
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      time: ref('19:42')
    }
  }
}
</script>
