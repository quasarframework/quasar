<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-sm" style="overflow-x: visible; overflow-y: auto; width: 300px; max-width: 20vw; max-height: 80vh">
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="cursor-pointer"
        :class="index === indexZoomed ? 'fixed-top-right q-mr-md q-mt-md z-top' : void 0"
        style="border-radius: 3%/5%;"
        :style="index === indexZoomed ? 'width: 800px; max-width: 70vw;' : void 0"
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
          onToggle: () => {
            this.indexZoomed = index
          },
          duration: 500,
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
          duration: 300
        })
      }
    }
  }
}
</script>
