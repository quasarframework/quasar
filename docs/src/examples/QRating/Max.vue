<template>
  <div class="q-pa-md">
    <q-rating
      v-model="ratingModel"
      size="2em"
      :max="10"
      color="primary"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      ratingModel: ref(3)
    }
  }
}
</script>
