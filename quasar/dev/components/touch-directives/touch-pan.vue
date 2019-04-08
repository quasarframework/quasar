<template>
  <div class="q-layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Click then pan in a direction with your mouse</span>
        <span class="mobile-only">Touch and pan in a direction</span>
        on the area below to see it in action.
        <br>
        Page scrolling is prevented, but you can opt out if you wish.
      </p>
      <div>
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.prevent.mouse.mousePrevent="handlePan"
        @click="onClick"
        class="custom-area row flex-center"
        ref="area"
      >
        <div v-if="info" class="custom-info">
          <pre>{{ info }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div class="row items-center">
            <q-icon name="arrow_back" />
            <div>Pan in any direction (mouse prevent)</div>
            <q-icon name="arrow_forward" />
          </div>
          <q-icon name="arrow_downward" />
        </div>

        <div v-if="panning" class="touch-signal">
          <q-icon name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Panning works both with a mouse or a native touch action.
        <br>
        You can also capture pan to certain directions (any) only as you'll see below.
      </p>

      <p class="caption">
        Example on capturing only horizontal panning.
        <br>
        Notice that on touch capable devices the scrolling is automatically not blocked, since
        we are only capturing horizontally.
      </p>
      <div>
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.horizontal.prevent.mouse.mouseStop.mousePrevent="panHorizontally"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="infoHorizontal" class="custom-info">
          <pre>{{ infoHorizontal }}</pre>
        </div>
        <div v-else class="row items-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_back" />
          <div>Pan to left or right only (mouse stop + prevent)</div>
          <q-icon name="arrow_forward" />
        </div>

        <div v-if="panningHorizontal" class="touch-signal">
          <q-icon name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Example on capturing only vertically panning.
        Page scrolling is prevented, but you can opt out if you wish.
      </p>
      <div>
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.vertical.prevent.mouse.mouseStop="panVertically"
        @click="onClick"
        class="custom-area row flex-center"
      >
        <div v-if="infoVertical" class="custom-info">
          <pre>{{ infoVertical }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div>
            Pan to up or down only (mouse stop)
          </div>
          <q-icon name="arrow_downward" />
        </div>

        <div v-if="panningVertical" class="touch-signal">
          <q-icon name="touch_app" />
        </div>
      </div>

      <p class="caption">
        For desktops, you can configure to avoid capturing mouse pans if you wish.
      </p>
    </div>
  </div>
</template>

<script>
import './touch-style.styl'

export default {
  data () {
    return {
      info: null,
      panning: false,
      clickStatus: null,

      infoHorizontal: null,
      panningHorizontal: false,

      infoVertical: null,
      panningVertical: false
    }
  },
  methods: {
    handlePan ({ position, direction, duration, distance, delta, isFirst, isFinal, evt }) {
      this.info = { position, direction, duration, distance, delta, isFirst, isFinal }

      // native Javascript event
      // console.log(evt)

      if (isFirst) {
        this.panning = true
        this.clickStatus = null
      }
      else if (isFinal) {
        this.panning = false
      }
    },
    panHorizontally ({ position, direction, duration, distance, delta, isFirst, isFinal, evt }) {
      this.infoHorizontal = { position, direction, duration, distance, delta, isFirst, isFinal }

      // native Javascript event
      // console.log(evt)

      if (isFirst) {
        this.panningHorizontal = true
        this.clickStatus = null
      }
      else if (isFinal) {
        this.panningHorizontal = false
      }
    },
    panVertically ({ position, direction, duration, distance, delta, isFirst, isFinal, evt }) {
      this.infoVertical = { position, direction, duration, distance, delta, isFirst, isFinal }

      // native Javascript event
      // console.log(evt)

      if (isFirst) {
        this.panningVertical = true
        this.clickStatus = null
      }
      else if (isFinal) {
        this.panningVertical = false
      }
    },

    onClick (evt) {
      console.log('click', evt)
      this.clickStatus = { stopped: evt.cancelBubble, prevented: evt.defaultPrevented }
    }
  }
}
</script>
