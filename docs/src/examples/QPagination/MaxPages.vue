<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      color="black"
      :max="10"
      :max-pages="6"
      :boundary-numbers="false"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 5
    }
  }
}
</script>
