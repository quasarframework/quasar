<template>
  <div class="quasar-parallax column items-center justify-center" :style="{height: height + 'px'}">
    <div class="quasar-parallax-image">
      <img
        v-el:img
        :src="src"
        @load="processImage()"
        :class="{ready: imageHasBeenLoaded}"
        style="transform: translate3D(-50%, 0, 0)"
      >
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
    },
    speed: {
      type: Number,
      default: 1,
      validator (value) {
        return value >= 0 && value <= 1
      }
    }
  },
  data () {
    return {
      imageHasBeenLoaded: false
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
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      this.imageHeight = Utils.dom.height(this.image)
      this.updatePosition()
    },
    updatePosition () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let containerTop, containerHeight, containerBottom, top, bottom

      if (this.scrollTarget === window) {
        containerTop = 0
        containerHeight = Utils.dom.viewport().height
        containerBottom = containerHeight
      }
      else {
        containerTop = Utils.dom.offset(this.scrollTarget).top
        containerHeight = Utils.dom.height(this.scrollTarget)
        containerBottom = containerTop + containerHeight
      }
      top = Utils.dom.offset(this.container).top
      bottom = top + this.height

      if (bottom > containerTop && top < containerBottom) {
        let percentScrolled = (containerBottom - top) / (this.height + containerHeight)
        let imageOffset = Math.round((this.imageHeight - this.height) * percentScrolled * this.speed)
        requestAnimationFrame(() => {
          this.$els.img.style.transform = 'translate3D(-50%,' + imageOffset + 'px, 0)'
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.container = this.$el
      this.image = this.$els.img

      this.scrollTarget = Utils.dom.getScrollTarget(this.$el)
      this.resizeHandler = Utils.debounce(this.processResize, 50)

      window.addEventListener('resize', this.resizeHandler)
      this.scrollTarget.addEventListener('scroll', this.updatePosition)
      this.processResize()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    this.scrollTarget.removeEventListener('scroll', this.updatePosition)
  }
}
</script>
