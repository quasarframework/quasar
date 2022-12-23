<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox dense v-model="teal" label="Teal" color="teal" />
      <q-checkbox dense v-model="orange" label="Orange" color="orange" />
      <q-checkbox dense v-model="red" label="Red" color="red" />
      <q-checkbox dense v-model="cyan" label="Cyan" color="cyan" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      teal: ref(true),
      orange: ref(false),
      red: ref(true),
      cyan: ref(false)
    }
  }
}
</script>
