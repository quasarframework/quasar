<template>
  <div class="q-pa-md">
    <q-checkbox v-model="val" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const val = ref(true)
</script>
