<template>
  <div class="q-pa-md">
    <div
      class="fixed-full image-gallery__blinder bg-grey-8"
      :class="indexZoomed !== void 0 ? 'image-gallery__blinder--active' : void 0"
      @click="zoomImage()"
    />

    <div
      class="row justify-center q-gutter-sm q-mx-auto scroll relative-position"
      style="max-width: 80vw; max-height: 80vh"
    >
      <q-img
        v-for="(src, index) in images"
        :key="index"
        ref="refThumb"
        class="image-gallery__image"
        :style="index === indexZoomed ? 'opacity: 0.3' : void 0"
        :src="src"
        @click="zoomImage(index)"
      />
    </div>

    <q-img
      ref="refFull"
      class="image-gallery__image image-gallery__image-full fixed-center"
      :class="indexZoomed !== void 0 ? 'image-gallery__image-full--active' : void 0"
      :src="images[indexZoomed]"
      @load="imgLoadedResolve"
      @error="imgLoadedReject"
      @click="zoomImage()"
    />
  </div>
</template>

<style lang="sass">
.image-gallery
  &__image
    border-radius: 3%/5%
    width: 150px
    max-width: 20vw
    cursor: pointer

    &-full
      width: 800px
      max-width: 70vw
      z-index: 2002
      pointer-events: none

      &--active
        pointer-events: all
  &__blinder
    opacity: 0
    z-index: 2000
    pointer-events: none
    transition: opacity 0.3s ease-in-out

    &--active
      opacity: 0.6
      pointer-events: all

      + div > .image-gallery__image
        z-index: 2001
</style>

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
            from: this.$refs.refThumb[index].$el,
            to: this.$refs.refFull.$el,
            onToggle: () => {
              this.indexZoomed = index
            },
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
        indexZoomed !== void 0 &&
        (this.cancel === void 0 || this.cancel() === false)
      ) {
        morph({
          from: this.$refs.refFull.$el,
          to: this.$refs.refThumb[indexZoomed].$el,
          onToggle: () => {
            this.indexZoomed = void 0
          },
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
