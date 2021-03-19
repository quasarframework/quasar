<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="purple"
      :max="10"
      :max-pages="6"
      boundary-numbers
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 6
    }
  }
}
</script>
