<template>
  <div>
    <div class="q-layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        to switch between fullscreen mode and default mode.
      </p>

      <div>Is fullscreen: {{ $q.fullscreen.isActive }}</div>

      <p>
        <q-btn
          color="secondary"
          @click="$q.fullscreen.toggle()"
          icon="zoom_out_map"
          label="Toggle Fullscreen ($q)"
        />
      </p>
      <p>
        <q-btn
          color="secondary"
          @click="toggleFullscreen()"
          icon="zoom_out_map"
          label="Toggle Fullscreen (import)"
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
  watch: {
    '$q.fullscreen.activeEl' (val) {
      console.log('watcher $q.fullscreen.activeEl', val, AppFullscreen.activeEl)
    },

    '$q.fullscreen.isActive' (val) {
      console.log('watcher $q.fullscreen.isActive', val, AppFullscreen.isActive)
    }
  },

  methods: {
    toggleFullscreen () {
      AppFullscreen.toggle()
        .then(() => {
          setTimeout(() => {
            console.log('setTimeout AppFullscreen.isActive', AppFullscreen.isActive)
          }, 1000)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
