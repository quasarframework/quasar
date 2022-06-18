<template>
  <div class="q-pa-md q-gutter-y-sm column">
    <q-toggle
      :label="`Model is ${blueModel} (default behaviour)`"
      v-model="blueModel"
    />

    <q-toggle
      :label="pinkModel"
      color="pink"
      false-value="Disagreed"
      true-value="Agreed"
      v-model="pinkModel"
    />

    <q-toggle
      :false-value="13"
      :label="`Model is number ${greenModel}`"
      :true-value="42"
      color="green"
      v-model="greenModel"
    />

    <q-toggle
      :false-value="true"
      :label="`Model is ${redModel} (flipped boolean)`"
      :true-value="false"
      color="red"
      v-model="redModel"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      blueModel: ref(true),
      pinkModel: ref('Agreed'),
      greenModel: ref(42),
      redModel: ref(true)
    }
  }
}
</script>
