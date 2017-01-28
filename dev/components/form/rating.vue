<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ratingModel}}</em></span>
      </div>

      <div style="font-size: 2rem; margin-top: 20px;">
        <q-rating v-model="ratingModel" :max="3"></q-rating>
        <q-rating class="primary" v-model="ratingModel" :max="5" icon="pets"></q-rating>
        <q-rating class="teal" v-model="ratingModel" :max="9" icon="thumb_up"></q-rating>
        <q-rating style="font-size: 3rem" class="red" v-model="ratingModel" :max="6" icon="favorite_border"></q-rating>
      </div>

      <p class="caption">Readonly State</p>
      <q-rating style="font-size: 2rem" class="primary" v-model="ratingModel" :max="6" icon="loyalty" readonly></q-rating>

      <p class="caption">Disabled State</p>
      <q-rating style="font-size: 2rem" class="primary" v-model="ratingModel" :max="6" icon="create" disable></q-rating>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 4
    }
  }
}
</script>
