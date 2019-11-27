<template>
  <div class="q-pa-md row justify-center">
    <q-card
      v-touch-pan.up.right.prevent.mouse="handlePan"
      class="custom-area cursor-pointer bg-primary text-white shadow-2 relative-position row flex-center"
    >
      <div v-if="info" class="custom-info">
        <pre>{{ info }}</pre>
      </div>
      <div v-else class="text-center">
        <q-icon name="arrow_upward" />
        <div class="row items-center">
          <div>Pan to up or to right</div>
          <q-icon name="arrow_forward" />
        </div>
      </div>

      <div v-show="panning" class="touch-signal">
        <q-icon name="touch_app" />
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      info: null,
      panning: false
    }
  },

  methods: {
    handlePan ({ evt, ...info }) {
      this.info = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panning = true
      }
      else if (info.isFinal) {
        this.panning = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-area
  width: 90%
  height: 480px
  border-radius: 3px
  padding: 8px

.custom-info pre
  width: 180px
  font-size: 12px

.touch-signal
  position: absolute
  top: 16px
  right: 16px
  width: 35px
  height: 35px
  font-size: 25px
  border-radius: 50% !important
  text-align: center
  background: rgba(255, 255, 255, .2)
</style>
