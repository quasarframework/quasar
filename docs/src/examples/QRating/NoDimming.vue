<template>
  <div class="q-pa-md">
    <q-rating
      v-model="model"
      max="5"
      size="3.5em"
      color="yellow"
      icon="star_border"
      icon-selected="star"
      icon-half="star_half"
      no-dimming
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(2.3)
    }
  }
}
</script>
