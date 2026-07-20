<template>
  <div class="q-pa-lg">
    <q-option-group v-model="group" :options="options" color="green" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const group = ref('op1')
const options = [
  {
    label: 'Option 1',
    value: 'op1'
  },
  {
    label: 'Option 2',
    value: 'op2',
    disable: false
  },
  {
    label: 'Option 3',
    value: 'op3',
    disable: true
  },
  {
    label: 'Option 4',
    value: 'op4',
    disable: true
  }
]
</script>
