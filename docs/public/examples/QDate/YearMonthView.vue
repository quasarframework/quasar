<template>
  <div class="q-pa-md">
    <q-date
      v-model="yearMonthView"
      only-month-view
      years-in-month-view
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      yearMonthView: ref(null),
    }
  }
}
</script>
