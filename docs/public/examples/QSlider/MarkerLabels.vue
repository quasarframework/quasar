<template>
  <div class="q-px-lg q-pt-md q-pb-xl">
    <q-slider
      v-model="model"
      marker-labels
      :min="0"
      :max="6"
    />

    <q-slider
      class="q-mt-xl"
      v-model="model"
      color="deep-orange"
      markers
      :marker-labels="fnMarkerLabel"
      :min="0"
      :max="6"
    />

    <q-slider
      class="q-mt-xl"
      v-model="model"
      color="purple"
      markers
      :marker-labels="objMarkerLabel"
      :min="0"
      :max="6"
    />

    <q-slider
      class="q-mt-xl"
      v-model="priceModel"
      color="green"
      :inner-min="3"
      :inner-max="6"
      markers
      :marker-labels="arrayMarkerLabel"
      label-always
      :label-value="priceLabel"
      switch-label-side
      switch-marker-labels-side
      :min="2"
      :max="7"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const model = ref(2)
    const priceModel = ref(4)

    return {
      model,
      fnMarkerLabel: val => `${10 * val}%`,
      objMarkerLabel: { 0: '0°C', 3: { label: '3°C' }, 5: '5°C', 6: '6°C' },

      priceModel,
      priceLabel: computed(() => `$ ${priceModel.value}`),
      arrayMarkerLabel: [
        { value: 3, label: '$3' },
        { value: 4, label: '$4' },
        { value: 5, label: '$5' },
        { value: 6, label: '$6' }
      ]
    }
  }
}
</script>
