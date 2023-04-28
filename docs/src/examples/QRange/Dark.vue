<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ model.min }} to {{ model.max }} (0 to 50)
    </q-badge>

    <q-range
      v-model="model"
      :min="0"
      :max="50"
      dark
    />
    <q-range
      v-model="model"
      :min="0"
      :max="50"
      color="green"
      dark
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 10,
        max: 35
      })
    }
  }
}
</script>
