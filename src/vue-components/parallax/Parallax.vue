<template>
  <div class="q-parallax column items-center justify-center" :style="{height: height + 'px'}">
    <div class="q-parallax-image">
      <img
        ref="img"
        :src="src"
        @load="__processImage()"
        :class="{ready: imageHasBeenLoaded}"
        style="transform: translate3D(-50%, 0, 0)"
      >
    </div>
    <div class="q-parallax-text">
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
      this.__updatePosition()
    }
  },
  methods: {
    __processImage () {
      this.imageHasBeenLoaded = true
      this.__processResize()
    },
    __processResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      this.imageHeight = Utils.dom.height(this.image)
      this.__updatePosition()
    },
    __updatePosition () {
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
          this.$refs.img.style.transform = 'translate3D(-50%,' + imageOffset + 'px, 0)'
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.container = this.$el
      this.image = this.$refs.img

      this.scrollTarget = Utils.dom.getScrollTarget(this.$el)
      this.resizeHandler = Utils.debounce(this.__processResize, 50)

      window.addEventListener('resize', this.resizeHandler)
      this.scrollTarget.addEventListener('scroll', this.__updatePosition)
      this.__processResize()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    this.scrollTarget.removeEventListener('scroll', this.__updatePosition)
  }
}
</script>
