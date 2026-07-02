<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-sm">
      <q-checkbox dark v-model="teal" label="Teal" color="teal" />
      <q-checkbox dark v-model="orange" label="Orange" color="orange" />
      <q-checkbox dark v-model="red" label="Red" color="red" />
      <q-checkbox dark v-model="cyan" label="Cyan" color="cyan" />
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
