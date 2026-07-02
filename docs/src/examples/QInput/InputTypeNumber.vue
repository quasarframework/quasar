<template>
  <div class="q-pa-md">
    <q-input
      v-model.number="model"
      type="number"
      filled
      style="max-width: 200px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(10)
</script>
