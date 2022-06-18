<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      landscape
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      date: ref('2019/02/01')
    }
  }
}
</script>
