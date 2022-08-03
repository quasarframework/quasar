<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        v-model="date"
        color="orange"
      />

      <q-date
        v-model="date"
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
      date: ref('2019/02/01')
    }
  }
}
</script>
