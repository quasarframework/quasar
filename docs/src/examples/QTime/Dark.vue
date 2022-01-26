<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <div class="q-gutter-md">
      <q-time
        v-model="time"
        dark
        bordered
      />

      <q-time
        v-model="time"
        color="orange"
        text-color="black"
        dark
        bordered
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
