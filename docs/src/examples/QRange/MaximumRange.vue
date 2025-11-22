<template>
  <div class="q-pa-lg">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ model.min }} to {{ model.max }} (0 to 10 w/ max-range 4 or 5)
    </q-badge>

    <q-range
      v-model="model"
      markers
      :min="0"
      :max="10"
      :max-range="4"
    />

    <q-range
      v-model="model"
      markers
      :min="0"
      :max="10"
      :max-range="5"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 3, max: 8
      })
    }
  }
}
</script>
