<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="deep-orange"
      :max="5"
      boundary-links
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
