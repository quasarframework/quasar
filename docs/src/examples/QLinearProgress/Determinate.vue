<template>
  <div class="q-pa-md">
    <q-btn size="sm" color="primary" @click="randomize" label="Change Model" />

    <q-linear-progress :value="progress" class="q-mt-md" />

    <q-linear-progress :value="progress" color="warning" class="q-mt-sm" />

    <q-linear-progress :value="progress" color="secondary" class="q-mt-sm" />

    <q-linear-progress
      :value="progress"
      rounded
      color="accent"
      class="q-mt-sm"
    />

    <q-linear-progress
      :value="progress"
      rounded
      color="purple"
      track-color="orange"
      class="q-mt-sm"
    />

    <q-linear-progress
      :value="progress"
      rounded
      color="negative"
      class="q-mt-sm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0.4)

function randomize() {
  progress.value = Math.random()
}
</script>
