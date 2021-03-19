<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="deep-orange"
      :max="5"
      boundary-links
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 3
    }
  }
}
</script>
