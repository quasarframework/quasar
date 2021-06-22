<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ model.min }} to {{ model.max }} (-20 to 20, step 4)
    </q-badge>

    <q-range
      v-model="model"
      :min="-20"
      :max="20"
      :step="4"
      :left-label-value="model.min + 'px'"
      :right-label-value="model.max + 'px'"
      label-always
      color="purple"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref({
        min: -12,
        max: 8
      })
    }
  }
}
</script>
