<template>
  <div class="q-pa-md">
    <q-badge color="grey-3" text-color="black" class="q-mb-sm">
      {{ hex }}
    </q-badge>

    <q-color
      :model-value="hex"
      @change="val => { hex = val }"
      style="max-width: 250px"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      hex: ref('#112e1b')
    }
  }
}
</script>
