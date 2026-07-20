<template>
  <div class="q-pa-md">
    <q-range v-model="model" color="secondary" :min="0" :max="50" disable />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  min: 10,
  max: 35
})
</script>
