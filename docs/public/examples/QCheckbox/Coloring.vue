<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox v-model="teal" label="Teal" color="teal" />
      <q-checkbox v-model="orange" label="Orange" color="orange" />
      <q-checkbox v-model="red" label="Red" color="red" />
      <q-checkbox v-model="cyan" label="Cyan" color="cyan" />
    </div>
    <div class="q-gutter-sm">
      <q-checkbox keep-color v-model="teal" label="Teal" color="teal" />
      <q-checkbox keep-color v-model="orange" label="Orange" color="orange" />
      <q-checkbox keep-color v-model="red" label="Red" color="red" />
      <q-checkbox keep-color v-model="cyan" label="Cyan" color="cyan" />
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
      red: ref(false),
      cyan: ref(true)
    }
  }
}
</script>
