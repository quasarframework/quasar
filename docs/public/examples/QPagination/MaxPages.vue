<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="black"
      :max="10"
      :max-pages="6"
      :boundary-numbers="false"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      current: ref(5)
    }
  }
}
</script>
