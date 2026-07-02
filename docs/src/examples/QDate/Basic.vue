<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" />

      <q-date v-model="date" minimal />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
