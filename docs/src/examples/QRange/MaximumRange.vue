<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ model.min }} to {{ model.max }} (0 to 10 w/ max-range 4 or 5)
    </q-badge>

    <q-range v-model="model" :min="0" :max="10" :max-range="4" markers />
    <q-range
      v-model="model"
      :min="0"
      :max="10"
      :max-range="5"
      color="green"
      markers
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  min: 3,
  max: 8
})
</script>
