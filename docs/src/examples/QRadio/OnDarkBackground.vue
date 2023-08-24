<template>
  <div class="q-pa-md bg-grey-9 text-white">
    <div class="q-gutter-sm">
      <q-radio dark v-model="shape" val="line" label="Line" />
      <q-radio dark v-model="shape" val="rectangle" label="Rectangle" />
      <q-radio dark v-model="shape" val="ellipse" label="Ellipse" />
      <q-radio dark v-model="shape" val="polygon" label="Polygon" />
    </div>
    <div class="q-px-sm">
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
