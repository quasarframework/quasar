<template>
  <div class="q-pa-md">
    <q-time v-model="time" format24h />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('19:42')
</script>
