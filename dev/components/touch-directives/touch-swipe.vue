<template>
  <div class="layout-padding docs-touch row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        <span class="desktop-only">Swipe with your mouse</span>
        <span class="mobile-only">Swipe</span>
        on the area below to see it in action.
      </p>
      <div
        v-touch-swipe="handleSwipe"
        class="custom-area row flex-center"
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
      </div>

      <p class="caption">
        Swipe works both with a mouse or a native touch action.
        <br>You can also capture swipe to certain directions (any) only as you'll see below.
      </p>

      <p class="caption">Example on capturing only swipe to right:</p>
      <div
        v-touch-swipe.right="swipeToRight"
        class="custom-area row flex-center"
      >
        <div v-if="infoRight" class="custom-info">
          <pre>{{ infoRight }}</pre>
        </div>
        <div v-else>
          Swipe to right only
          <q-icon name="arrow_forward" />
        </div>
      </div>

      <p class="caption">Example on capturing only swipe up and right:</p>
      <div
        v-touch-swipe.up.right="swipeToCustom"
        class="custom-area row flex-center"
      >
        <div v-if="infoCustom" class="custom-info">
          <pre>{{ infoCustom }}</pre>
        </div>
        <div v-else class="text-center">
          <q-icon name="arrow_upward" />
          <div class="row items-center">
            <div>Swipe up or right</div>
            <q-icon name="arrow_forward" />
          </div>
        </div>
      </div>

      <p class="caption">For desktops, you can configure to avoid capturing mouse swipes if you wish.</p>
    </div>
  </div>
</template>

<script>
import './touch-style.styl'

export default {
  data () {
    return {
      info: null,
      infoRight: null,
      infoCustom: null
    }
  },
  methods: {
    handleSwipe ({ direction, duration, distance, evt }) {
      this.info = { direction, duration, distance }

      // native Javascript event
      console.log(evt)
    },
    swipeToRight ({ direction, duration, distance }) {
      this.infoRight = { direction, duration, distance }
    },
    swipeToCustom ({ direction, duration, distance }) {
      this.infoCustom = { direction, duration, distance }
    }
  }
}
</script>
