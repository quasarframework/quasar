<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="grey"
        :color-selected="ratingColors"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      ratingModel: ref(4),
      ratingColors: [ 'light-green-3', 'light-green-6', 'green', 'green-9', 'green-10' ]
    }
  }
}
</script>
