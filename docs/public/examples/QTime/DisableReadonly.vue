<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time
        v-model="time"
        disable
      />

      <q-time
        v-model="time"
        readonly
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
