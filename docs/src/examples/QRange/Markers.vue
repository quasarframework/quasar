<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ marker.min }} to {{ marker.max }} (-6 to 10, step 2)
    </q-badge>

    <q-range
      v-model="marker"
      :min="-6"
      :max="10"
      :step="2"
      label
      markers
      color="orange"
    />

    <q-range
      v-model="marker"
      :min="-6"
      :max="10"
      :step="2"
      label
      snap
      markers
      color="purple"
    />

    <q-badge color="secondary">
      Model: {{ orangeModel }}<br>(0 to 16, step 2, marker step 4)
    </q-badge>
    <q-range
      v-model="orangeModel"
      :min="-8"
      :max="16"
      :step="2"
      label
      snap
      :markers="4"
      color="orange"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      marker: ref({
        min: 6,
        max: 8
      }),

      orangeModel: ref({
        min: 6,
        max: 10
      })
    }
  }
}
</script>
