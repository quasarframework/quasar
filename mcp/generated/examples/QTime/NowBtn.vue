<template>
  <div class="q-pa-md">
    <q-time v-model="time" now-btn />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('04:56')
</script>
