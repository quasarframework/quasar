<template>
  <div class="q-pa-md">
    <q-range v-model="standard" color="secondary" :min="0" :max="50" readonly />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const standard = ref({
  min: 10,
  max: 35
})
</script>
