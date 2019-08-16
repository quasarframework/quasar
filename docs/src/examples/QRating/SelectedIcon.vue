<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        size="3.5em"
        color="green-5"
        icon="star_border"
        icon-selected="star"
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
  }
}
</script>
