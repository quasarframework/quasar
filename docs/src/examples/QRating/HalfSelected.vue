<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-rating
        v-model="model1"
        max="7"
        size="3em"
        color="green-5"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
      />

      <q-rating
        v-model="model2"
        max="7"
        size="3em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        no-dimming
      />

      <q-rating
        v-model="model3"
        max="7"
        size="3em"
        color="red"
        color-selected="red-9"
        icon="favorite_border"
        icon-selected="favorite"
        icon-half="favorite"
        no-dimming
      />

      <div>
        <q-btn
          color="grey"
          no-caps
          label="Reset"
          @click="resetModels"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model1: 3.5,
      model2: 2.3,
      model3: 4.5
    }
  },

  methods: {
    resetModels () {
      this.model1 = 3.5
      this.model2 = 2.3
      this.model3 = 4.5
    }
  }
}
</script>
