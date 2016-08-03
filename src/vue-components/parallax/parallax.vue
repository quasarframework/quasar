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
import $ from 'jquery'

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

      this.image.css('min-height', Math.max(this.height, this.pageContainer.innerHeight()))
      this.imageHeight = this.image.height()

      this.updatePosition()
    },
    updatePosition () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let
        containerTop = this.pageContainer.offset().top,
        containerHeight = this.pageContainer.innerHeight(),
        containerBottom = containerTop + containerHeight,

        top = this.container.offset().top,
        bottom = top + this.height


      if (bottom > containerTop && top < containerBottom) {
        this.imageOffset = Math.round(containerTop - top + (containerHeight - this.imageHeight) / 2)
      }
    }
  },
  ready () {
    this.container = $(this.$el)
    this.image = $(this.$els.img)

    this.pageContainer = this.container.parents('.layout-scroll-area')
    if (this.pageContainer.length === 0) {
      this.pageContainer = $('#quasar-app')
    }
    this.pageContainer.scroll(this.updatePosition)
    this.processResize()
  },
  beforeDestroy () {
    $(window).off('resize', this.processResize)
    this.pageContainer.off('scroll', this.updatePosition)
  }
}
</script>
