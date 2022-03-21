<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="line" label="Line" />
      <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rectangle" label="Rectangle" />
      <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="ellipse" label="Ellipse" />
      <q-radio v-model="shape" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="polygon" label="Polygon" />
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
