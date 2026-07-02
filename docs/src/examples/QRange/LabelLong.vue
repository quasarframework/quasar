<template>
  <div class="q-pa-md">
    <q-range
      class="q-mt-lg"
      v-model="model"
      :min="-20"
      :max="20"
      :step="4"
      :left-label-value="'Value: ' + model.min + 'px'"
      :right-label-value="'Value: ' + model.max + 'px'"
      label-always
      color="purple"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref({
  min: -16,
  max: 16
})
</script>
