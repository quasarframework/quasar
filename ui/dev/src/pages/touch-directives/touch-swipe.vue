<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Swipe with your mouse</span>
        <span class="mobile-only">Swipe</span>
        on the area below to see it in action.
      </p>

      <q-toggle v-model="disable" label="Directive disabled" />
      <div
        v-touch-swipe.mouse="computedHandleSwipe"
        @click="onClick"
        class="custom-area row flex-center relative-position"
      >
        <q-icon class="absolute-top-left" size="md" name="drag_indicator" draggable />

        <div v-if="info" class="custom-info">
          <pre>{{ info }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div class="row items-center">
            <q-icon name="arrow_back" />
            <div>Swipe in any direction</div>
            <q-icon name="arrow_forward" />
          </div>
          <q-icon name="arrow_downward" />
        </div>
      </div>

      <p class="caption">
        Swipe works both with a mouse or a native touch action.
        <br>You can also capture swipe to certain directions (any) only as you'll see below.
      </p>

      <p class="caption">
        Example on capturing only swipe to right:
      </p>
      <div
        v-touch-swipe.right.mouse="swipeToRight"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="infoRight" class="custom-info">
          <pre>{{ infoRight }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder">
          Swipe to right only
          <q-icon name="arrow_forward" />
        </div>
      </div>

      <p class="caption">
        Example on capturing only swipe up and right:
      </p>
      <div
        v-touch-swipe.up.right.mouse="swipeToCustom"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="infoCustom" class="custom-info">
          <pre>{{ infoCustom }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div class="row items-center">
            <div>Swipe up or right</div>
            <q-icon name="arrow_forward" />
          </div>
        </div>
      </div>

      <p class="caption">
        Swipe test (preventing it from inner square)
      </p>
      <div
        v-touch-swipe.mouse="handleSwipeTest"
        @click="onClick"
        class="row flex-center"
      >
        <div @touchstart="handleEvt" @mousedown="handleEvt" style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2">
          <div>
            <q-toggle dark color="black" v-model="swipeTestStopPropagation" label="Stop propagation" />
          </div>
          <div v-if="infoTest" class="custom-info">
            <pre>{{ infoTest }}</pre>
          </div>
          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            <q-icon name="arrow_upward" />
            <div class="row items-center">
              <q-icon name="arrow_back" />
              <div>Swipe in any direction</div>
              <q-icon name="arrow_forward" />
            </div>
            <q-icon name="arrow_downward" />
          </div>
        </div>
      </div>

      <p class="caption">
        Swipe test (capture + preventing it from inner square)
        -- should still work
      </p>
      <div
        v-touch-swipe.capture.mouse.mouseCapture="handleSwipeTestCapture"
        @click="onClick"
        class="row flex-center"
      >
        <div @touchstart.stop @mousedown.stop style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2">
          <div v-if="infoTestCapture" class="custom-info">
            <pre>{{ infoTestCapture }}</pre>
          </div>
          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            <q-icon name="arrow_upward" />
            <div class="row items-center">
              <q-icon name="arrow_back" />
              <div>Swipe in any direction</div>
              <q-icon name="arrow_forward" />
            </div>
            <q-icon name="arrow_downward" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './touch-style.sass'

export default {
  data () {
    return {
      info: null,
      infoRight: null,
      infoCustom: null,
      infoTest: null,
      infoTestCapture: null,
      swipeTestStopPropagation: true,
      disable: false
    }
  },

  computed: {
    computedHandleSwipe () {
      return this.disable === true ? void 0 : this.handleSwipe
    }
  },

  methods: {
    handleSwipe ({ evt, ...info }) {
      this.info = info

      // native Javascript event
      console.log(evt)
    },

    handleSwipeTest ({ evt, ...info }) {
      this.infoTest = info

      // native Javascript event
      console.log(evt)
    },

    handleSwipeTestCapture ({ evt, ...info }) {
      this.infoTestCapture = info

      // native Javascript event
      console.log(evt)
    },

    swipeToRight ({ evt, ...info }) {
      this.infoRight = info
    },

    swipeToCustom ({ evt, ...info }) {
      this.infoCustom = info
    },

    onClick () {
      console.log('onClick')
    },

    handleEvt (e) {
      if (this.swipeTestStopPropagation) {
        e.stopPropagation()
      }
    }
  }
}
</script>
