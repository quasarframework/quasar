<template>
  <div class="q-pa-md">
    <q-date v-model="date" today-btn />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
