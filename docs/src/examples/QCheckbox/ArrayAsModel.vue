<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox v-model="selection" val="teal" label="Teal" color="teal" />
      <q-checkbox v-model="selection" val="orange" label="Orange" color="orange" />
      <q-checkbox v-model="selection" val="red" label="Red" color="red" />
      <q-checkbox v-model="selection" val="cyan" label="Cyan" color="cyan" />
    </div>

    <div class="q-px-sm">
      The model data: <strong>{{ selection }}</strong>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      selection: ref([ 'teal', 'red' ])
    }
  }
}
</script>
