<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click and hold with your mouse</span>
        <span class="mobile-only">Touch and hold</span>
        on the area below to see it in action.
        <br>
        Notice that on touch capable devices the scrolling is not blocked.
      </p>

      <q-toggle v-model="disable" label="Directive disabled" />
      <div
        v-touch-hold.mouse="computedHandler"
        @click="onEvt('click')"
        @mousedown="onEvt('mousedown')"
        @mousemove="onEvt('mousemove')"
        @mouseup="onEvt('mouseup')"
        @touchstart="onEvt('touchstart')"
        @touchmove="onEvt('touchmove')"
        @touchend="onEvt('touchend')"
        class="custom-area row flex-center"
      >
        <div v-if="info" class="custom-info">
          <pre>{{ info }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          Click/touch and hold for at least 600ms.
        </div>
      </div>

      <p class="caption">
        Configuring to trigger after custom time (in this case 3s):
      </p>
      <div
        v-touch-hold:3000.mouse="holdExtended"
        @click="onEvt('click')"
        @mousedown="onEvt('mousedown')"
        @mousemove="onEvt('mousemove')"
        @mouseup="onEvt('mouseup')"
        @touchstart="onEvt('touchstart')"
        @touchmove="onEvt('touchmove')"
        @touchend="onEvt('touchend')"
        class="custom-area row flex-center"
      >
        <div v-if="infoExtended" class="custom-info">
          <pre>{{ infoExtended }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder">
          Click/touch and hold for 3 seconds
        </div>
      </div>

      <p class="caption">
        Custom duration (1500 ms) and sensitivities (100px/100px):
      </p>
      <div
        v-touch-hold:1500:100:100.mouse="holdCustom"
        @click="onEvt('click')"
        @mousedown="onEvt('mousedown')"
        @mousemove="onEvt('mousemove')"
        @mouseup="onEvt('mouseup')"
        @touchstart="onEvt('touchstart')"
        @touchmove="onEvt('touchmove')"
        @touchend="onEvt('touchend')"
        class="custom-area row flex-center"
      >
        <div v-if="infoCustom" class="custom-info">
          <pre>{{ infoCustom }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder">
          Click/touch and hold for 1.5 seconds
        </div>
      </div>

      <p class="caption">
        test (preventing it from inner square)
      </p>
      <div
        v-touch-hold.mouse="holdTest"
        @click="onEvt('click')"
        @mousedown="onEvt('mousedown')"
        @mousemove="onEvt('mousemove')"
        @mouseup="onEvt('mouseup')"
        @touchstart="onEvt('touchstart')"
        @touchmove="onEvt('touchmove')"
        @touchend="onEvt('touchend')"
        class="row flex-center"
      >
        <div @touchstart="handleEvt" @mousedown="handleEvt" style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2">
          <div>
            <q-toggle dark color="black" v-model="holdTestStopPropagation" label="Stop propagation" />
          </div>
          <div v-if="infoTest" class="custom-info">
            <pre>{{ infoTest }}</pre>
          </div>
          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            Touch/click and hold
          </div>
        </div>
      </div>

      <p class="caption">
        test (capture + preventing it from inner square)
        -- should still work
      </p>
      <div
        v-touch-hold.capture.mouse.mouseCapture="holdTestCapture"
        @click="onEvt('click')"
        @mousedown="onEvt('mousedown')"
        @mousemove="onEvt('mousemove')"
        @mouseup="onEvt('mouseup')"
        @touchstart="onEvt('touchstart')"
        @touchmove="onEvt('touchmove')"
        @touchend="onEvt('touchend')"
        class="row flex-center"
      >
        <div @touchstart.stop @mousedown.stop style="padding: 24px" class="cursor-pointer bg-primary text-white rounded-borders shadow-2">
          <div v-if="infoTestCapture" class="custom-info">
            <pre>{{ infoTestCapture }}</pre>
          </div>
          <div v-else class="text-center q-pa-xl custom-area-placeholder">
            Touch/click and hold
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
      infoExtended: null,
      infoCustom: null,
      disable: false,

      infoTest: null,
      holdTestStopPropagation: true,

      infoTestCapture: null
    }
  },

  computed: {
    computedHandler () {
      return this.disable === true ? void 0 : this.handleHold
    }
  },

  methods: {
    handleHold ({ evt, ...info }) {
      this.info = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    holdExtended ({ evt, ...info }) {
      this.infoExtended = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    holdCustom ({ evt, ...info }) {
      this.infoCustom = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    holdTest ({ evt, ...info }) {
      this.infoTest = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    holdTestCapture ({ evt, ...info }) {
      this.infoTestCapture = info

      // native Javascript event
      console.log('TRIGGER', evt)
    },

    onEvt (reason) {
      console.log('@' + reason)
    },

    handleEvt (e) {
      if (this.holdTestStopPropagation) {
        e.stopPropagation()
      }
    }
  }
}
</script>
