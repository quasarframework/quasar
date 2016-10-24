<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ratingModel}}</em></span>
      </div>

      <div style="font-size: 2rem; margin-top: 20px;">
        <quasar-rating v-model="ratingModel" :max="3"></quasar-rating>
        <quasar-rating class="primary" v-model="ratingModel" :max="5" icon="pets"></quasar-rating>
        <quasar-rating class="orange" v-model="ratingModel" :max="9" icon="thumb_up"></quasar-rating>
        <quasar-rating style="font-size: 3rem" class="teal" v-model="ratingModel" :max="6" icon="home"></quasar-rating>
      </div>

      <p class="caption">Disabled State</p>
      <quasar-rating style="font-size: 2rem" class="primary" v-model="ratingModel" :max="6" icon="create" disable></quasar-rating>
    </div>
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
