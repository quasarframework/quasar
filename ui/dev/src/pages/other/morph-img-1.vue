<template>
  <div class="q-pa-md">
    <div class="row justify-center q-gutter-sm q-mx-auto" style="max-width: 80vw">
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="cursor-pointer"
        style="border-radius: 3%/5%; width: 300px; max-width: 20vw"
        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>

    <q-img
      ref="refFull"
      class="cursor-pointer fixed-center z-top"
      :class="indexZoomed === void 0 ? 'no-pointer-events' : void 0"
      style="border-radius: 3%/5%; width: 800px; max-width: 70vw"
      :src="images[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
  </div>
</template>

<script>
import { morph } from 'quasar'

export default {
  data () {
    return {
      indexZoomed: void 0,
      imgLoaded: {
        promise: Promise.resolve(),
        resolve: () => {},
        reject: () => {}
      },
      images: Array(24).fill(null).map((_, i) => 'https://picsum.photos/id/' + i + '/500/300')
    }
  },

  methods: {
    imgLoadedResolve () {
      this.imgLoaded.resolve()
    },

    imgLoadedReject () {
      this.imgLoaded.reject()
    },

    zoomImage (index) {
      const { indexZoomed } = this

      this.imgLoaded.reject()

      const zoom = () => {
        if (index !== void 0 && index !== indexZoomed) {
          this.imgLoaded.promise = new Promise((resolve, reject) => {
            this.imgLoaded.resolve = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              resolve()
            }
            this.imgLoaded.reject = () => {
              this.imgLoaded.resolve = () => {}
              this.imgLoaded.reject = () => {}

              reject()
            }
          })

          this.cancel = morph({
            from: this.$refs.refThumb[ index ].$el,
            to: this.$refs.refFull.$el,
            onToggle: () => { this.indexZoomed = index },
            waitFor: this.imgLoaded.promise,
            duration: 400,
            hideFromClone: true,
            onEnd: end => {
              if (end === 'from' && this.indexZoomed === index) {
                this.indexZoomed = void 0
              }
            }
          })
        }
      }

      if (
        indexZoomed !== void 0
        && (this.cancel === void 0 || this.cancel() === false)
      ) {
        morph({
          from: this.$refs.refFull.$el,
          to: this.$refs.refThumb[ indexZoomed ].$el,
          onToggle: () => { this.indexZoomed = void 0 },
          duration: 200,
          keepToClone: true,
          onEnd: zoom
        })
      }
      else {
        zoom()
      }
    }
  }
}
</script>
