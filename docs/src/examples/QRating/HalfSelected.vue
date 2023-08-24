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
import { ref } from 'vue'

export default {
  setup () {
    const model1 = ref(3.5)
    const model2 = ref(2.3)
    const model3 = ref(4.5)

    return {
      model1,
      model2,
      model3,

      resetModels () {
        model1.value = 3.5
        model2.value = 2.3
        model3.value = 4.5
      }
    }
  }
}
</script>
