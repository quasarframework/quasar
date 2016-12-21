<template>
  <div class="q-back-to-top">
    <div ref="content" class="q-back-to-top">
      <slot></slot>
    </div>
    <div class="q-back-to-top-fab" v-show="showBackButton">
      <button class="circular raised" @click="__goTop()" :class="classNames" style="right: 18px; bottom: 18px;">
        <i class="q-fab-icon">{{icon}}</i>
      </button>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    classNames: {
      default: 'primary fixed-bottom-right'
    },
    icon: {
      type: String,
      default: 'keyboard_arrow_up'
    },
    offset: {
      type: Number,
      default: 0
    },
    toTopPage: {       /* if true go to top of page, otherwise to top of component (that could be not at top of page) */
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showBackButton: false,
      working: true
    }
  },
  methods: {
    __processResize () {
      if (!this.scrollContainer) {
        return
      }

      this.containerHeight = Utils.dom.height(this.scrollContainer)
      this.containerTop = Utils.dom.offset(this.scrollContainer).top
      this.containerBottom = Utils.dom.offset(this.scrollContainer).top + this.containerHeight

      this.triggerPosition = Math.round(this.containerTop + this.containerBottom / 2 + this.offset)

      this.__updatePosition()
    },
    __updatePosition (event) {
      if (!this.working) {
        return
      }

      this.position = window.scrollY

      if ((this.position) > this.triggerPosition) {
        this.showBackButton = true
      }
      else {
        this.showBackButton = false
      }
    },
    __goTop () {
      if (!this.working) {
        return
      }
      this.stop()
      Velocity(this.element, 'scroll', {offset: (this.toTopPage ? -this.position : 0), mobileHA: false})
      this.resume()
    },
    resume () {
      this.working = true
      this.scrollContainer.addEventListener('scroll', this.__updatePosition)
      this.__updatePosition()
    },
    stop () {
      this.working = false
      this.scrollContainer.removeEventListener('scroll', this.__updatePosition)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.element = this.$refs.content

      this.scrollContainer = Utils.dom.getScrollTarget(this.$el)
      this.resizeHandler = Utils.debounce(this.__processResize, 50)

      window.addEventListener('resize', this.resizeHandler)
      this.scrollContainer.addEventListener('scroll', this.__updatePosition)
      this.__processResize()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    this.scrollContainer.removeEventListener('scroll', this.__updatePosition)
  }
}
</script>
