<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ label.min }} to {{ label.max }} (-20 to 20, step 4)
    </q-badge>

    <q-range
      v-model="label"
      :min="-20"
      :max="20"
      :step="4"
      label-always
      color="brown"
    />
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup () {
    return {
      label: reactive({
        min: -12,
        max: 8
      })
    }
  }
}
</script>
