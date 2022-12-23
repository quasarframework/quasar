<template>
  <div class="q-pa-md q-pb-lg">
    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20, step 4)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      label-always
      color="light-green"
    />

    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20, step 4)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      label
      label-always
      switch-label-side
      color="red"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(0)
    }
  }
}
</script>
