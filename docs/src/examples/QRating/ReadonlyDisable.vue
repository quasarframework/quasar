<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating v-model="ratingModel" size="2em" color="orange" readonly />

      <q-rating v-model="ratingModel" size="2em" color="purple" disable />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
