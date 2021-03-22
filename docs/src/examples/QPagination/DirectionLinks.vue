<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      direction-links
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      current: ref(3)
    }
  }
}
</script>
