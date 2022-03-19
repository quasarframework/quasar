<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      readonly
    />
    <q-slider
      v-model="greenModel"
      color="green"
      readonly
      :min="0"
      :max="50"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      basicModel: ref(20),
      greenModel: ref(30)
    }
  }
}
</script>
