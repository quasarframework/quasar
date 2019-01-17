<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-swipe="handleSwipe"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <q-icon name="arrow_back" />
          <div>Swipe in any direction</div>
          <q-icon name="arrow_forward" />
        </div>
        <q-icon name="arrow_downward" />
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
    handleSwipe ({ evt, ...info }) {
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
  font-size 12px
</style>
