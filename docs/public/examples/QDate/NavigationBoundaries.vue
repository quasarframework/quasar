<template>
  <div class="q-pa-md">
    <q-date
      v-model="date"
      navigation-min-year-month="2020/07"
      navigation-max-year-month="2020/09"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      date: ref('2020/07/04')
    }
  }
}
</script>
