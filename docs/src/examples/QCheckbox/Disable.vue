<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox disable v-model="teal" label="One" />
      <q-checkbox disable v-model="orange" label="Two" />
      <q-checkbox disable v-model="red" label="Three" />
      <q-checkbox disable v-model="cyan" label="Four" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const teal = ref(true)
const orange = ref(false)
const red = ref(false)
const cyan = ref(true)
</script>
