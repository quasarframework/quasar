<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date v-model="date" color="orange" />

      <q-date v-model="date" color="yellow" text-color="black" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
