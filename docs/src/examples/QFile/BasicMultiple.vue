<template>
  <div class="q-pa-md">
    <q-file
      v-model="files"
      label="Pick files"
      filled
      multiple
      style="max-width: 300px"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref(null)
</script>
