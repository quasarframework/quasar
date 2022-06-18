<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time"
        color="orange"
      />

      <q-time
        v-model="time"
        color="yellow"
        text-color="black"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      time: ref('10:56')
    }
  }
}
</script>
