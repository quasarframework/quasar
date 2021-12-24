<template>
  <div class="q-pa-lg">
    <q-range
      v-model="model"
      color="orange"
      thumb-color="purple"
      label-color="black"
      label-text-color="yellow"
      markers
      marker-labels
      switch-marker-labels-side
      label-always
      switch-label-side
      :min="0"
      :max="6"
    />

    <q-range
      class="q-mt-xl"
      v-model="model"
      color="orange"
      left-thumb-color="purple-3"
      left-label-color="green"
      right-thumb-color="purple-8"
      right-label-color="black"
      markers
      marker-labels
      switch-marker-labels-side
      label-always
      switch-label-side
      :min="0"
      :max="6"
    />

    <q-range
      class="q-mt-xl"
      v-model="secondModel"
      color="green"
      track-color="orange"
      inner-track-color="transparent"
      selection-color="red"
      :max="10"
      markers
    />

    <q-range
      v-model="secondModel"
      color="purple"
      inner-track-color="light-blue-3"
      :max="10"
      :inner-min="2"
      :inner-max="8"
      markers
    />

    <q-range
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
      model: ref({
        min: 2, max: 4
      }),

      secondModel: ref({
        min: 3, max: 5
      })
    }
  }
}
</script>
