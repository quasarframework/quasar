<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="black"
      :max="10"
      :max-pages="6"
      :boundary-numbers="false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(5)
</script>
