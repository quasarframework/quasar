<template>
  <div class="q-pa-md">
    <q-rating
      v-model="ratingModel"
      size="2em"
      :max="10"
      color="primary"
    />
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
