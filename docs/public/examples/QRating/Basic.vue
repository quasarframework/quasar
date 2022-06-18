<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        size="1.5em"
        icon="thumb_up"
      />
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="red-7"
        icon="favorite_border"
      />
      <q-rating
        v-model="ratingModel"
        size="2.5em"
        color="purple-4"
        icon="create"
      />
      <q-rating
        v-model="ratingModel"
        size="3em"
        color="brown-5"
        icon="pets"
      />
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="green-5"
        icon="star_border"
      />
    </div>
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
