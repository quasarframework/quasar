<template>
  <div class="q-pa-md">
    <q-slider v-model="basicModel" disable />

    <q-slider v-model="greenModel" color="green" disable :min="0" :max="50" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const basicModel = ref(40)
const greenModel = ref(10)
</script>
