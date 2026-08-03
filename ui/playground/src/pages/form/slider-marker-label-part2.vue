<template>
  <div class="q-px-lg q-pt-md q-pb-xl">
    <q-slider v-model="model" markers marker-labels :min="0" :max="10" />

    <q-slider
      class="q-mt-xl"
      v-model="model"
      markers
      :marker-labels="fnMarkerLabel"
      :min="0"
      :max="10"
    />

    <q-slider
      class="q-mt-xl"
      v-model="model"
      markers
      :marker-labels="objMarkerLabel"
      :min="0"
      :max="10"
    />

    <q-slider
      class="q-mt-xl"
      v-model="priceModel"
      color="green"
      :inner-min="3"
      :inner-max="8"
      markers
      :marker-labels="arrayMarkerLabel"
      :min="2"
      :max="10"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(2)
const fnMarkerLabel = val => 10 * val + '%'
const objMarkerLabel = { 0: '0°C', 3: { label: '3°C' }, 5: '5°C', 10: '10°C' }

const priceModel = ref(5)
const arrayMarkerLabel = [
  { value: 3, label: '$3' },
  { value: 4, label: '$4' },
  { value: 5, label: '$5' },
  { value: 6, label: '$6' },
  { value: 7, label: '$7' },
  { value: 8, label: '$8' }
]
</script>
