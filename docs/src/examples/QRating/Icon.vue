<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-rating
        v-model="ratingModel"
        size="2em"
        icon="thumb_up"
      />
    </div>
    <div class="row justify-center">
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="red-7"
        icon="favorite_border"
      />
    </div>
    <div class="row justify-center">
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="purple-4"
        icon="create"
      />
    </div>
    <div class="row justify-center">
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="brown-5"
        icon="pets"
      />
    </div>
    <div class="row justify-center">
      <q-rating
        v-model="ratingModel"
        size="2em"
        color="green-5"
        icon="star_border"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 3
    }
  },

  methods: {
  }
}
</script>
