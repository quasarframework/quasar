<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <q-badge color="secondary">
      Model: {{ value }} (-20 to 20, step 4)
    </q-badge>

    <q-slider
      v-model="value"
      :min="-20"
      :max="20"
      :step="4"
      dark
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
      dark
      label
      label-always
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
