<template>
  <div class="q-pa-lg">
    <q-slider
      v-model="firstModel"
      color="orange"
      thumb-color="purple"
      label-color="black"
      label-text-color="yellow"
      markers
      marker-labels
      marker-labels-class="text-orange"
      switch-marker-labels-side
      label-always
      switch-label-side
      :min="0"
      :max="6"
    />

    <q-slider
      class="q-mt-xl"
      v-model="secondModel"
      color="green"
      track-color="orange"
      inner-track-color="transparent"
      selection-color="red"
      :max="10"
      markers
    />

    <q-slider
      v-model="secondModel"
      color="purple"
      inner-track-color="light-blue-3"
      :max="10"
      :inner-min="2"
      :inner-max="8"
      markers
    />

    <q-slider
      v-model="secondModel"
      color="teal"
      track-color="light-blue-2"
      inner-track-color="light-blue-5"
      :max="10"
      :inner-min="2"
      :inner-max="8"
      markers
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      firstModel: ref(2),
      secondModel: ref(4)
    }
  }
}
</script>
