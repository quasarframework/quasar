<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination v-model="current" :max="5" input />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(3)
</script>
