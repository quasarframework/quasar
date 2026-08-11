<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-time v-model="time" landscape />

      <q-time v-model="timeWithSeconds" with-seconds landscape />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time = ref('10:56')
const timeWithSeconds = ref('09:24:10')
</script>
