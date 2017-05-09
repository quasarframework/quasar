<template>
  <div
    v-if="$q.platform.is.desktop"
    class="q-scrollarea scroll relative-position overflow-hidden"
    @mousewheel="__mouseWheel"
    @DOMMouseScroll="__mouseWheel"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="absolute" v-touch-pan.vertical.nomouse="__panContainer">
      <slot></slot>
      <q-resize-observable @resize="__updateScrollHeight"></q-resize-observable>
      <q-scroll-observable @scroll="__updateScroll"></q-scroll-observable>
    </div>

    <q-resize-observable @resize="__updateContainer"></q-resize-observable>
    <div
      class="q-scrollarea-thumb absolute-right"
      :style="thumbStyle"
      :class="{visible: thumbVisible}"
      v-touch-pan.vertical="__panThumb"
    ></div>
  </div>
  <div
    v-else
    class="scroll relative-position"
  >
    <slot></slot>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import { getMouseWheelDistance } from '../../utils/event'
import { QResizeObservable, QScrollObservable } from '../observables'
import TouchPan from '../../directives/touch-pan'

export default {
  name: 'q-scroll-area',
  components: {
    QResizeObservable,
    QScrollObservable
  },
  directives: {
    TouchPan
  },
  props: {
    width: {
      type: String,
      default: '10px'
    },
    delay: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      active: false,
      hover: false,
      containerHeight: 0,
      scrollPosition: 0,
      scrollHeight: 0
    }
  },
  computed: {
    thumbVisible () {
      return this.thumbHeight < this.scrollHeight && (this.active || this.hover)
    },
    thumbHeight () {
      return Math.round(Math.max(20, this.containerHeight * this.containerHeight / this.scrollHeight))
    },
    thumbStyle () {
      const top = Math.min(
        this.scrollPosition + (this.scrollPercentage * (this.containerHeight - this.thumbHeight)),
        this.scrollHeight - this.thumbHeight
      )
      return {
        top: `${top}px`,
        width: this.width,
        height: `${this.thumbHeight}px`
      }
    },
    scrollPercentage () {
      const p = between(this.scrollPosition / (this.scrollHeight - this.containerHeight), 0, 1)
      return Math.round(p * 10000) / 10000
    }
  },
  methods: {
    __updateContainer (size) {
      if (this.containerHeight !== size.height) {
        this.containerHeight = size.height
        this.__setActive(true, true)
      }
    },
    __updateScroll (scroll) {
      if (this.scrollPosition !== scroll.position) {
        this.scrollPosition = scroll.position
        this.__setActive(true, true)
      }
    },
    __updateScrollHeight ({height}) {
      if (this.scrollHeight !== height) {
        this.scrollHeight = height
        this.__setActive(true, true)
      }
    },
    __panThumb (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition
        this.__setActive(true, true)
      }
      if (e.isFinal) {
        this.__setActive(false)
      }

      const
        sign = (e.direction === 'down' ? 1 : -1),
        multiplier = (this.scrollHeight - this.containerHeight) / (this.containerHeight - this.thumbHeight)

      this.$el.scrollTop = this.refPos + sign * e.distance.y * multiplier
    },
    __panContainer (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition
        this.__setActive(true, true)
      }
      if (e.isFinal) {
        this.__setActive(false)
      }

      const el = this.$el
      el.scrollTop = this.refPos + (e.direction === 'down' ? -1 : 1) * e.distance.y
      if (el.scrollTop > 0 && el.scrollTop + this.containerHeight < this.scrollHeight) {
        e.evt.preventDefault()
      }
    },
    __mouseWheel (e) {
      const el = this.$el
      el.scrollTop += getMouseWheelDistance(e).pixelY
      if (el.scrollTop > 0 && el.scrollTop + this.containerHeight < this.scrollHeight) {
        e.preventDefault()
      }
    },
    __setActive (active, timer) {
      clearTimeout(this.timer)
      if (active === this.active) {
        if (active && this.timer) {
          this.__startTimer()
        }
        return
      }

      if (active) {
        this.active = true
        if (timer) {
          this.__startTimer()
        }
      }
      else {
        this.active = false
      }
    },
    __startTimer () {
      this.timer = setTimeout(() => {
        this.active = false
        this.timer = null
      }, this.delay)
    }
  }
}
</script>
