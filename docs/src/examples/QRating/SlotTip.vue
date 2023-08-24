<template>
  <div class="q-pa-md">
    <q-rating
      v-model="ratingModel"
      size="2em"
      :max="3"
      color="primary"
    >
      <template v-slot:tip-1>
        <q-tooltip>Not bad</q-tooltip>
      </template>
      <template v-slot:tip-2>
        <q-tooltip>Good</q-tooltip>
      </template>
      <template v-slot:tip-3>
        <q-tooltip>Very good!</q-tooltip>
      </template>
    </q-rating>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      ratingModel: ref(2)
    }
  }
}
</script>
