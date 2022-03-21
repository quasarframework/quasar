<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ model.min }} to {{ model.max }} (0 to 50 w/ selection 10 to 35 or 15 to 40)
    </q-badge>

    <q-range v-model="model" :min="0" :max="50" :inner-min="10" :inner-max="35" />
    <q-range v-model="model" :min="0" :max="50" color="green" :inner-min="15" :inner-max="40" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: 20,
        max: 25
      })
    }
  }
}
</script>
