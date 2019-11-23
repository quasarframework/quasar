<template>
  <div class="q-pa-md">
    <q-rating
      v-model="ratingModel"
      size="2em"
      :max="3"
      color="primary"
    >
      <template v-slot:icon-content-1>
        <q-tooltip>Not bad</q-tooltip>
      </template>
      <template v-slot:icon-content-2>
        <q-tooltip>Good</q-tooltip>
      </template>
      <template v-slot:icon-content-3>
        <q-tooltip>Very good!</q-tooltip>
      </template>
    </q-rating>
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
