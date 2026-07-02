<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-md">
      <q-date v-model="date" dark bordered />

      <q-date v-model="date" color="orange" text-color="black" dark bordered />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2019/02/01')
</script>
