<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span v-show="$q.platform.is.desktop">Click</span>
        <span v-show="$q.platform.is.mobile">Tap</span>
        to switch between fullscreen mode and default mode.
      </p>

      <p>
        <q-btn
          color="secondary"
          @click="toggleFullscreen()"
          icon="zoom_out_map"
          label="Toggle Fullscreen"
        />
      </p>

      <p class="caption">
        On some phones this will have little effect:
      </p>
      <ul class="light-paragraph">
        <li>
          For example, on Samsung S4, when App goes into fullscreen, the top bar
          will slide up but still remain on screen.
        </li>
        <li>
          On Nexus phones, on the other hand, like Nexus 5, Android navigation
          buttons and top bar dissapear completely.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { AppFullscreen } from 'quasar'

export default {
  methods: {
    toggleFullscreen () {
      AppFullscreen.toggle()
    }
  }
}
</script>
