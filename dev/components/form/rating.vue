<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ratingModel}}</em></span>
      </div>

      <div style="font-size: 2rem; margin-top: 20px;">
        <q-rating v-model="ratingModel" :max="3" @change="onChange" @input="onInput"></q-rating>
        <br>
        <q-rating color="primary" :value="ratingModel" :max="5" icon="pets" @change="val => { ratingModel = val; onChange(val); }" @input="onInput"></q-rating>
        <br>
        <q-rating color="teal" v-model="ratingModel" :max="9" icon="thumb_up"></q-rating>
        <br>
        <q-rating size="3rem" color="red" v-model="ratingModel" :max="6" icon="favorite_border"></q-rating>
      </div>

      <p class="caption">Readonly State</p>
      <q-rating size="2rem" color="primary" v-model="ratingModel" :max="6" icon="loyalty" readonly></q-rating>

      <p class="caption">Disabled State</p>
      <q-rating size="2rem" color="primary" v-model="ratingModel" :max="6" icon="create" disable></q-rating>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 4
    }
  },
  watch: {
    ratingModel (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
