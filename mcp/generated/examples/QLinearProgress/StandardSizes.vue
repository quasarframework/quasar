<template>
  <div class="q-pa-md q-gutter-md">
    <q-linear-progress
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      :value="progress"
      color="primary"
      @click="randomize"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0.65)

function randomize() {
  progress.value = Math.random()
}
</script>
