<template>
  <div class="q-pa-md">
    <div class="row no-wrap q-gutter-x-sm" style="overflow-x: auto; overflow-y: visible;">
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="cursor-pointer"
        :class="index === indexZoomed ? 'fixed-center z-top' : void 0"
        style="border-radius: 3%/5%; flex: 0 0 20vw"
        :style="index === indexZoomed ? 'width: 800px; max-width: 70vw' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>
  </div>
</template>

<script>
import { morph } from 'quasar'

export default {
  data () {
    return {
      indexZoomed: void 0,
      images: Array(24).fill(null).map((_, i) => 'https://picsum.photos/id/' + i + '/500/300')
    }
  },

  methods: {
    zoomImage (index) {
      const { indexZoomed } = this

      this.indexZoomed = void 0

      if (index !== void 0 && index !== indexZoomed) {
        this.cancel = morph({
          from: this.$refs.refThumb[index].$el,
          onToggle: () => { this.indexZoomed = index },
          duration: 500,
          style: 'z-index: 1',
          onEnd: end => {
            if (end === 'from' && this.indexZoomed === index) {
              this.indexZoomed = void 0
            }
          }
        })
      }

      if (
        indexZoomed !== void 0 &&
        (this.cancel === void 0 || this.cancel() === false)
      ) {
        morph({
          from: this.$refs.refThumb[indexZoomed].$el,
          waitFor: 100,
          duration: 300,
          style: 'z-index: 1'
        })
      }
    }
  }
}
</script>
