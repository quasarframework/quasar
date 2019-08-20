<template>
  <div>
    <div class="q-layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ ratingModel }}</em></span>
      </div>

      <div style="font-size: 2rem; margin-top: 20px;">
        <q-rating v-model="ratingModel" max="3" @change="onChange" @input="onInput" />
        <br>
        <q-rating v-model="ratingModel" color="primary" max="5" icon="pets" @input="onInput" />
        <br>
        <q-rating color="teal" v-model="ratingModel" max="9" icon="thumb_up" />
        <br>
        <q-rating size="3rem" color="red" v-model="ratingModel" :max="6" icon="favorite_border" />
        <br>
        <q-rating size="3rem" color="red" v-model="ratingModel" :max="6" icon="img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
        <br>
        <q-rating size="3rem" color="red" v-model="ratingModel" :max="6" icon="star_border" icon-selected="star" />
        <br>
        <q-rating size="3rem" color="red" v-model="moodModel" :max="4" :icon="ratingIcons" />
      </div>

      <p class="caption">
        Readonly State
      </p>
      <q-rating size="2rem" color="primary" v-model="ratingModel" max="6" icon="loyalty" readonly />

      <p class="caption">
        Disabled State
      </p>
      <q-rating size="2rem" color="primary" v-model="ratingModel" max="6" icon="create" disable />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ratingModel: 4,
      moodModel: 2,
      ratingIcons: [
        'sentiment_very_dissatisfied',
        'sentiment_dissatisfied',
        'sentiment_satisfied',
        'sentiment_very_satisfied'
      ]
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
