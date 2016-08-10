<template>
  <div class="quasar-parallax column items-center justify-center" :style="{height: height + 'px'}">
    <div class="quasar-parallax-image">
      <img
        v-el:img
        :src="src"
        @load="processImage()"
        :class="{ready: imageHasBeenLoaded}"
        :style="{transform: 'translate3D(-50%,' + imageOffset + 'px, 0)'}">
    </div>
    <div class="quasar-parallax-text">
      <slot name="loading" v-if="!imageHasBeenLoaded"></slot>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      imageHasBeenLoaded: false,
      imageOffset: 0
    }
  },
  watch: {
    src () {
      this.imageHasBeenLoaded = false
    },
    height () {
      this.updatePosition()
    }
  },
  methods: {
    processImage () {
      this.imageHasBeenLoaded = true
      this.processResize()
    },
    processResize () {
      if (!this.imageHasBeenLoaded || !this.pageContainer) {
        return
      }

      this.image.style.minHeight = Math.max(this.height, Utils.dom.height(this.pageContainer))
      this.imageHeight = Utils.dom.height(this.image)

      this.updatePosition()
    },
    updatePosition () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let
        containerTop = Utils.dom.offset(this.pageContainer).top,
        containerHeight = Utils.dom.height(this.pageContainer),
        containerBottom = containerTop + containerHeight,
        top = Utils.dom.offset(this.container).top,
        bottom = top + this.height

      if (bottom > containerTop && top < containerBottom) {
        this.imageOffset = Math.round(containerTop - top + (containerHeight - this.imageHeight) / 2)
      }
    }
  },
  ready () {
    this.container = this.$el
    this.image = this.$els.img

    this.pageContainer = this.$el.closest('.layout-scroll-area')
    if (!this.pageContainer) {
      this.pageContainer = document.getElementById('quasar-app')
    }
    this.pageContainer.addEventListener('scroll', this.updatePosition)
    this.resizeHandler = Utils.debounce(this.processResize, 50)
    window.addEventListener('resize', this.resizeHandler)

    this.processResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    this.pageContainer.removeEventListener('scroll', this.updatePosition)
  }
}
</script>
