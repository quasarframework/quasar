<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      disable
    />

    <q-slider
      v-model="greenModel"
      color="green"
      disable
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
      basicModel: ref(40),
      greenModel: ref(10)
    }
  }
}
</script>
