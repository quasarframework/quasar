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
      })
    }
  }
}
</script>
