<template>
  <div
    v-if="$q.platform.is.desktop"
    class="q-scrollarea relative-position"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div
      ref="target"
      class="scroll relative-position overflow-hidden full-height full-width"
      @wheel="__mouseWheel"
      @mousewheel="__mouseWheel"
      @DOMMouseScroll="__mouseWheel"
      v-touch-pan.vertical.nomouse="__panContainer"
    >
      <div class="absolute full-width" :style="mainStyle">
        <slot></slot>
        <q-resize-observable class="resize-obs" @resize="__updateScrollHeight"></q-resize-observable>
      </div>
      <q-scroll-observable class="scroll-obs" @scroll="__updateScroll"></q-scroll-observable>
    </div>

    <q-resize-observable class="main-resize-obs" @resize="__updateContainer"></q-resize-observable>

    <div
      class="q-scrollarea-thumb absolute-right"
      :style="style"
      :class="{'invisible-thumb': thumbHidden}"
      v-touch-pan.vertical="__panThumb"
    ></div>
  </div>
  <div
    v-else
    class="q-scroll-area scroll relative-position"
    :style="contentStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
import extend from '../../utils/extend'
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
    thumbStyle: {
      type: Object,
      default: () => ({})
    },
    contentStyle: {
      type: Object,
      default: () => ({})
    },
    contentActiveStyle: {
      type: Object,
      default: () => ({})
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
    thumbHidden () {
      return this.scrollHeight <= this.containerHeight || (!this.active && !this.hover)
    },
    thumbHeight () {
      return Math.round(between(this.containerHeight * this.containerHeight / this.scrollHeight, 50, this.containerHeight))
    },
    style () {
      const top = this.scrollPercentage * (this.containerHeight - this.thumbHeight)
      return extend({}, this.thumbStyle, {
        top: `${top}px`,
        height: `${this.thumbHeight}px`
      })
    },
    mainStyle () {
      return this.thumbHidden ? this.contentStyle : this.contentActiveStyle
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
      e.evt.preventDefault()

      if (e.isFirst) {
        this.refPos = this.scrollPosition
        this.__setActive(true, true)
        document.body.classList.add('non-selectable')
        if (document.selection) {
          document.selection.empty()
        }
        else if (window.getSelection) {
          window.getSelection().removeAllRanges()
        }
      }
      if (e.isFinal) {
        this.__setActive(false)
        document.body.classList.remove('non-selectable')
      }

      const multiplier = (this.scrollHeight - this.containerHeight) / (this.containerHeight - this.thumbHeight)
      this.$refs.target.scrollTop = this.refPos + (e.direction === 'down' ? 1 : -1) * e.distance.y * multiplier
    },
    __panContainer (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition
        this.__setActive(true, true)
      }
      if (e.isFinal) {
        this.__setActive(false)
      }

      const pos = this.refPos + (e.direction === 'down' ? -1 : 1) * e.distance.y
      this.$refs.target.scrollTop = pos

      if (pos > 0 && pos + this.containerHeight < this.scrollHeight) {
        e.evt.preventDefault()
      }
    },
    __mouseWheel (e) {
      const el = this.$refs.target
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
