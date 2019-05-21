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
        v-touch-pan.prevent.mouse="handlePan"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
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
            <div>Pan in any direction</div>
            <q-icon name="arrow_forward" />
          </div>
          <q-icon name="arrow_downward" />
        </div>

        <div v-if="panning" class="touch-signal">
          <q-icon name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Page scrolling is prevented, but you can opt out if you wish.
      </p>
      <div>
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.prevent.right.mouse="handlePanRight"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
        ref="area"
      >
        <div v-if="infoRight" class="custom-info">
          <pre>{{ infoRight }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <div class="row items-center">
            <div>Pan right</div>
            <q-icon name="arrow_forward" />
          </div>
        </div>

        <div v-if="panningRight" class="touch-signal">
          <q-icon name="touch_app" />
        </div>
      </div>

      <p class="caption">
        Page scrolling is prevented, but you can opt out if you wish.
      </p>
      <div>
        Click status: {{ clickStatus }}
      </div>
      <div
        v-touch-pan.prevent.up.right.mouse="handlePanUpRight"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
        ref="area"
      >
        <div v-if="infoUpRight" class="custom-info">
          <pre>{{ infoUpRight }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div class="row items-center">
            <div>Pan up & right</div>
            <q-icon name="arrow_forward" />
          </div>
        </div>

        <div v-if="panningUpRight" class="touch-signal">
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
        v-touch-pan.horizontal.prevent.mouse.mouseStop="panHorizontally"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
      >
        <div v-if="infoHorizontal" class="custom-info">
          <pre>{{ infoHorizontal }}</pre>
        </div>
        <div v-else class="row items-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_back" />
          <div>Pan to left or right only</div>
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
        v-touch-pan.vertical.prevent.mouse="panVertically"
        @click="e => onEvt('click', e)"
        @mousedown="e => onEvt('mousedown', e)"
        @mousemove="e => onEvt('mousemove', e)"
        @mouseup="e => onEvt('mouseup', e)"
        class="custom-area row flex-center"
      >
        <div v-if="infoVertical" class="custom-info">
          <pre>{{ infoVertical }}</pre>
        </div>
        <div v-else class="text-center q-pa-xl custom-area-placeholder">
          <q-icon name="arrow_upward" />
          <div>
            Pan to up or down only
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

      infoRight: null,
      panningRight: false,

      infoUpRight: null,
      panningUpRight: false,

      infoHorizontal: null,
      panningHorizontal: false,

      infoVertical: null,
      panningVertical: false
    }
  },
  methods: {
    handlePan ({ evt, ...info }) {
      this.info = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panning = true
        this.clickStatus = null
      }
      else if (info.isFinal) {
        this.panning = false
      }
    },
    handlePanRight ({ evt, ...info }) {
      this.infoRight = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panningRight = true
        this.clickStatus = null
      }
      else if (info.isFinal) {
        this.panningRight = false
      }
    },
    handlePanUpRight ({ evt, ...info }) {
      this.infoUpRight = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panningUpRight = true
        this.clickStatus = null
      }
      else if (info.isFinal) {
        this.panningUpRight = false
      }
    },
    panHorizontally ({ evt, ...info }) {
      this.infoHorizontal = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panningHorizontal = true
        this.clickStatus = null
      }
      else if (info.isFinal) {
        this.panningHorizontal = false
      }
    },
    panVertically ({ evt, ...info }) {
      this.infoVertical = info

      // native Javascript event
      // console.log(evt)

      if (info.isFirst) {
        this.panningVertical = true
        this.clickStatus = null
      }
      else if (info.isFinal) {
        this.panningVertical = false
      }
    },

    onEvt (reason, evt) {
      console.log('@' + reason)
      if (reason === 'click') {
        this.clickStatus = { stopped: evt.cancelBubble, prevented: evt.defaultPrevented }
      }
    }
  }
}
</script>
