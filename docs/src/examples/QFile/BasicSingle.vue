<template>
  <div class="q-pa-md">
    <q-file
      v-model="file"
      label="Pick one file"
      filled
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const file = ref(null)
</script>
