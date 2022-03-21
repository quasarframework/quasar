<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      default-year-month="1964/08"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      date: ref(null)
    }
  }
}
</script>
