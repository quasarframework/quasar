<template>
  <div class="q-pa-md">
    <q-option-group :options="options" type="toggle" v-model="group" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const group = ref([])
const options = [
  { label: 'Battery too low', value: 'bat' },
  { label: 'Friend request', value: 'friend', color: 'green' },
  { label: 'Picture uploaded', value: 'upload', color: 'red' }
]
</script>
