<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ days }}
    </div>

    <q-date v-model="days" multiple />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      days: ref([ '2019/02/01', '2019/02/10' ])
    }
  }
}
</script>
