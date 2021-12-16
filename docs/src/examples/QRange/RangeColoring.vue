<template>
  <div class="q-pa-lg">
    <q-range
      v-model="model"
      color="orange"
      thumb-color="purple"
      label-color="black"
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
      right-thumb-color="purple-8"
      left-label-color="green"
      right-label-color="black"
      markers
      marker-labels
      switch-marker-labels-side
      label-always
      switch-label-side
      :min="0"
      :max="6"
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
      })
    }
  }
}
</script>
