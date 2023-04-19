<template>
  <div class="q-pa-md">
    <q-toggle
      v-model="value"
      color="primary"
      disable
    />

    <q-toggle
      v-model="value"
      color="green"
      disable
    />

    <q-toggle
      v-model="value"
      color="yellow"
      disable
    />

    <q-toggle
      v-model="value"
      color="red"
      disable
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
