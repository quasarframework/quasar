<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line> Model: "{{ model }}" </q-badge>

      <q-select filled v-model="model" :options="options" label="Standard" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
</script>
