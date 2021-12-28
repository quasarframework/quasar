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
export default {
  data () {
    return {
      model: 2,
      objMarkerLabel: { 0: '0°C', 3: { label: '3°C' }, 5: '5°C', 6: '6°C' },

      priceModel: 4,
      arrayMarkerLabel: [
        { value: 3, label: '$3' },
        { value: 4, label: '$4' },
        { value: 5, label: '$5' },
        { value: 6, label: '$6' }
      ]
    }
  },

  computed: {
    priceLabel () {
      return `$ ${this.priceModel}`
    }
  },

  methods: {
    fnMarkerLabel (val) {
      return `${10 * val}%`
    }
  }
}
</script>
