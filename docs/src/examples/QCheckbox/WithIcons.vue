<template>
  <div class="q-pa-md">
    <q-checkbox
      v-model="val"
      checked-icon="star"
      unchecked-icon="star_border"
      indeterminate-icon="help"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      val: ref(true)
    }
  }
}
</script>
