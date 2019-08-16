<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="ratingModel"
        :max="4"
        size="3.5em"
        color="green-5"
        :icon="icons"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 3,
      icons: [
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_satisfied',
        'sentiment_very_satisfied'
      ]
    }
  }
}
</script>
