<template>
  <p>Model: <strong>{{ratingModel}}</strong></p>
  <div style="font-size: 2rem; margin-top: 20px;">
    <quasar-rating :model.sync="ratingModel" :max-grade="3"></quasar-rating>
    <quasar-rating :model.sync="ratingModel" :max-grade="5" icon="pets"></quasar-rating>
    <quasar-rating :model.sync="ratingModel" :max-grade="9" icon="thumb_up"></quasar-rating>
    <quasar-rating :model.sync="ratingModel" :max-grade="6" icon="home"></quasar-rating>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 1
    }
  }
}
</script>
