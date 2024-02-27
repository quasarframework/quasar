<template>
  <div class="q-pa-md">
    <q-date
      v-model="onlyYearDate"
      only-year-view
    />

     <q-date
      v-model="onlyMonthDate"
      only-month-view
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      onlyYearDate: ref(null),
      onlyMonthDate: ref(null)
    }
  }
}
</script>
