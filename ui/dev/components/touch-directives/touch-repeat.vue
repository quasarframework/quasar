<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click and hold with your mouse</span>
        <span class="mobile-only">Touch and hold</span>
        on the area below to see it in action.
        <br>
        The default repeat pattern is 0:600:300* (ms).
        <br>
        Notice that on touch capable devices the scrolling is not blocked if first timer is > 0.
      </p>

      <div
        v-touch-repeat.mouse="handleHold1"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="info1" class="custom-info">
          <pre>{{ info1 }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          Click/touch and hold.
        </div>
      </div>

      <p class="caption">
        Configured to also react to <kbd>SPACE</kbd>, <kbd>ENTER</kbd> and <kbd>h</kbd>, with 0:300* (ms) repeat pattern:
      </p>
      <div
        v-touch-repeat:0:300.mouse.enter.space.72.104="handleHold2"
        @click="onClick"
        class="custom-area row flex-center"
        tabindex="0"
      >
        <div v-if="info2" class="custom-info">
          <pre>{{ info2 }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder">
          Click/touch or press SPACE/ENTER/H and hold
        </div>
      </div>

      <p class="caption">
        Configured to also react to <kbd>ENTER</kbd> and <kbd>h</kbd>, with 1000:300* (ms) repeat pattern:
      </p>
      <div
        v-touch-repeat:1000:300.mouse.enter.72.104="handleHold3"
        @click="onClick"
        class="custom-area row flex-center"
        tabindex="0"
      >
        <div v-if="info3" class="custom-info">
          <pre>{{ info3 }}</pre>
        </div>
        <div v-else class="q-pa-xl custom-area-placeholder">
          Click/touch or press ENTER/H and hold
        </div>
      </div>

      <div style="height: 500px">
        Scroll on purpose
      </div>
    </div>
  </div>
</template>

<script>
import './touch-style.styl'

export default {
  data () {
    return {
      info1: null,
      info2: null,
      info3: null
    }
  },
  methods: {
    handleHold1 ({ keyboard, startTime, duration, repeatCount, evt }) {
      this.info1 = { keyboard, startTime, duration, repeatCount }

      // native Javascript event
      console.log(evt)
    },
    handleHold2 ({ keyboard, startTime, duration, repeatCount, evt }) {
      this.info2 = { keyboard, startTime, duration, repeatCount }
      if (keyboard) {
        this.info2.key = evt.key
        this.info2.code = evt.code
      }

      // native Javascript event
      console.log(evt)
    },
    handleHold3 ({ evt, ...info }) {
      this.info3 = info
      if (info.keyboard) {
        this.info3.key = evt.key
        this.info3.code = evt.code
      }

      // native Javascript event
      console.log(evt)
    },

    onClick () {
      console.log('click')
    }
  }
}
</script>
