<template>
  <div>
    <DocTable :rows="classes" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DocTable from 'src/components/DocTable.vue'

const classes = ref([
  { name: 'no-shadow', description: 'Remove any shadow' },
  { name: 'inset-shadow', description: 'Set an inset shadow on top' },
  { name: 'inset-shadow-down', description: 'Set an inset shadow on bottom' },
  { name: 'shadow-1', description: 'Set a depth of 1' },
  { name: 'shadow-2', description: 'Set a depth of 2' },
  { name: 'shadow-N', description: 'Where `N` is an integer from 1 to 24.' },
  { name: 'shadow-transition', description: 'Apply the default CSS transition effect on the shadow' }
])
</script>
