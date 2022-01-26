<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio left-label v-model="shape" val="line" label="Line" />
      <q-radio left-label v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio left-label v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio left-label v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-gutter-sm">
      <q-radio left-label v-model="shape" dense val="line" label="Line" />
      <q-radio left-label v-model="shape" dense val="rectangle" label="Rectangle" />
      <q-radio left-label v-model="shape" dense val="ellipse" label="Ellipse" />
      <q-radio left-label v-model="shape" dense val="polygon" label="Polygon" />
    </div>
    <div class="q-mt-md">
      Your selection is: <strong>{{ shape }}</strong>
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
