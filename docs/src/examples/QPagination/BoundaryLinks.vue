<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="deep-orange"
      :max="5"
      :boundary-links="true"
    >
    </q-pagination>
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
