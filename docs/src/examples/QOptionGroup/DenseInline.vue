<template>
  <div class="q-pa-lg">
    <q-option-group
      v-model="group"
      :options="options"
      color="primary"
      inline
      dense
    />
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
    value: 'op2'
  },
  {
    label: 'Option 3',
    value: 'op3'
  }
]
</script>
