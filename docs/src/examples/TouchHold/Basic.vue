<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-hold="handleHold"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        Click/touch and hold for at least 600ms.
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: null
    }
  },

  methods: {
    handleHold ({ evt, ...info }) {
      this.info = info
      // native Javascript event
      // console.log(evt)
    }
  }
}
</script>

<style lang="stylus" scoped>
.custom-area
  width 80%
  height 200px
  border-radius 3px

.custom-info pre
  width 250px
</style>
