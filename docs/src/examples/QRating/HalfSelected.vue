<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <div>Average rating:</div>

      <q-rating
        :value="model"
        @input="addRating"
        max="7"
        size="3.5em"
        color="green-5"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
      />

      <q-rating
        :value="model"
        @input="addRating"
        max="7"
        size="3.5em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        no-dimming
      />

      <q-rating
        :value="model"
        @input="addRating"
        max="7"
        size="3.5em"
        color="grey-4"
        color-half="blue"
        color-selected="green"
        icon="favorite_border"
        icon-selected="favorite"
        no-dimming
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: [ 3.5 ]
    }
  },

  computed: {
    model () {
      return this.ratingModel.length === 0
        ? 0
        : this.ratingModel.reduce((acc, rating) => acc + rating, 0) / this.ratingModel.length
    }
  },

  methods: {
    addRating (value) {
      this.ratingModel.push(value)
    }
  }
}
</script>
