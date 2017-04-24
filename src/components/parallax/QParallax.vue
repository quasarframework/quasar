<template>
  <div class="q-parallax" :style="{height: height + 'px'}">
    <div class="q-parallax-image absolute-full">
      <img
        ref="img"
        :src="src"
        @load="__processImage()"
        :class="{ready: imageHasBeenLoaded}"
      >
    </div>
    <div class="q-parallax-text absolute-full column items-center justify-center">
      <slot name="loading" v-if="!imageHasBeenLoaded"></slot>
      <slot v-else></slot>
    </div>
  </div>
</template>

<script>
import { height, viewport, offset, css, cssTransform } from '../../utils/dom'
import { debounce, frameDebounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'

export default {
  name: 'q-parallax',
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
      imageHasBeenLoaded: false,
      scrolling: false
    }
  },
  watch: {
    src () {
      this.imageHasBeenLoaded = false
    },
    height () {
      this.__updatePos()
    }
  },
  methods: {
    __processImage () {
      this.imageHasBeenLoaded = true
      this.__onResize()
    },
    __onResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      if (this.scrollTarget === window) {
        this.viewportHeight = viewport().height
      }
      this.imageHeight = height(this.image)
      this.__updatePos()
    },
    __updatePos () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      let containerTop, containerHeight, containerBottom, top, bottom

      if (this.scrollTarget === window) {
        containerTop = 0
        containerHeight = this.viewportHeight
        containerBottom = containerHeight
      }
      else {
        containerTop = offset(this.scrollTarget).top
        containerHeight = height(this.scrollTarget)
        containerBottom = containerTop + containerHeight
      }
      top = offset(this.container).top
      bottom = top + this.height

      if (bottom > containerTop && top < containerBottom) {
        const percentScrolled = (containerBottom - top) / (this.height + containerHeight)
        this.__setPos(Math.round((this.imageHeight - this.height) * percentScrolled * this.speed))
      }
    },
    __setPos (offset) {
      css(this.$refs.img, cssTransform(`translate3D(-50%,${offset}px, 0)`))
    }
  },
  created () {
    this.__setPos = frameDebounce(this.__setPos)
  },
  mounted () {
    this.$nextTick(() => {
      this.container = this.$el
      this.image = this.$refs.img

      this.scrollTarget = getScrollTarget(this.$el)
      this.resizeHandler = debounce(this.__onResize, 50)

      window.addEventListener('resize', this.resizeHandler)
      this.scrollTarget.addEventListener('scroll', this.__updatePos)
      this.__onResize()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    this.scrollTarget.removeEventListener('scroll', this.__updatePos)
  }
}
</script>
