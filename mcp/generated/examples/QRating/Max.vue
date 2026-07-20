<template>
  <div class="q-pa-md">
    <q-rating v-model="ratingModel" size="2em" :max="10" color="primary" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ratingModel = ref(3)
</script>
