<template>
  <div class="q-pa-md">
    <q-slider v-model="basicModel" readonly />
    <q-slider v-model="greenModel" color="green" readonly :min="0" :max="50" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const basicModel = ref(20)
const greenModel = ref(30)
</script>
