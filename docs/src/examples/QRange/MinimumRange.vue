<template>
  <div class="q-pa-lg">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ model.min }} to {{ model.max }} (0 to 10 w/ min-range 2 or 3)
    </q-badge>

    <q-range
      v-model="model"
      markers
      :min="0"
      :max="10"
      :min-range="2"
    />

    <q-range
      v-model="model"
      markers
      :min="0"
      :max="10"
      :min-range="3"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 5, max: 7
      })
    }
  }
}
</script>
