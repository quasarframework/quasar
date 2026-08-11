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

<script setup>
import { ref } from 'vue'

const teal = ref(true)
const orange = ref(false)
const red = ref(true)
const cyan = ref(false)
</script>
