<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio disable v-model="shape" val="line" label="Line" />
      <q-radio disable v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio disable v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio disable v-model="shape" val="polygon" label="Polygon" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      shape: ref('line')
    }
  }
}
</script>
