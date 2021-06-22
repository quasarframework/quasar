<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ standard }} (0 to 50)
    </q-badge>

    <div class="row justify-around">
      <q-slider
        v-model="standard"
        :min="0"
        :max="50"
        vertical
        label
      />

      <q-slider
        v-model="standard"
        :min="0"
        :max="50"
        color="green"
        vertical
        reverse
        label-always
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      standard: ref(10)
    }
  }
}
</script>
