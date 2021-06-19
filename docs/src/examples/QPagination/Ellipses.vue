<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="teal"
      :max="10"
      :max-pages="5"
      :ellipses="false"
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
