<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-secondary text-white q-my-md shadow-2">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />

      <q-space />

      <q-btn-toggle
        v-model="model"
        flat
        stretch
        toggle-color="yellow"
        :options="options"
      />
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('one')
const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' }
]
</script>
