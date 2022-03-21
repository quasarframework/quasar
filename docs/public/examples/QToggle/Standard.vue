<template>
  <div class="q-pa-md">
    <q-toggle v-model="value" />

    <q-toggle
      v-model="value"
      color="green"
    />

    <q-toggle
      v-model="value"
      color="yellow"
    />

    <q-toggle
      v-model="value"
      color="red"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(true)
    }
  }
}
</script>
