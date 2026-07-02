<template>
  <div class="q-px-lg q-py-md">
    <q-range
      v-model="model"
      :min="0"
      :max="10"
      color="green"
      track-size="10px"
      thumb-color="black"
      markers
    />

    <q-range
      v-model="model"
      :min="0"
      :max="10"
      color="green"
      thumb-size="35px"
      markers
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  min: 1,
  max: 6
})
</script>
