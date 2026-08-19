<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ model.min }} to {{ model.max }} (0 to 10 w/ min-range 2 or 3)
    </q-badge>

    <q-range v-model="model" :min="0" :max="10" :min-range="2" markers />
    <q-range
      v-model="model"
      :min="0"
      :max="10"
      :min-range="3"
      color="green"
      markers
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  min: 4,
  max: 6
})
</script>
