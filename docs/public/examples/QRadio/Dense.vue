<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="q-gutter-sm">
      <q-radio dense v-model="shape" val="line" label="Line" />
      <q-radio dense v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio dense v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio dense v-model="shape" val="polygon" label="Polygon" />
    </div>

    <div class="q-px-sm q-pt-sm">
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
