import Vue from 'vue'

import { between } from '../../utils/format.js'
import { getMouseWheelDistance } from '../../utils/event.js'
import { setScrollPosition, setHorisontalScrollPosition } from '../../utils/scroll.js'
import slot from '../../utils/slot.js'
import QResizeObserver from '../observer/QResizeObserver.js'
import QScrollObserver from '../observer/QScrollObserver.js'
import TouchPan from '../../directives/TouchPan.js'

export default Vue.extend({
  name: 'QScrollArea',

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
      type: [String, Number],
      default: 1000
    },
    horisontal: {
      type: [String, Boolean],
      default: false
    }
  },

  data () {
    return {
      active: false,
      hover: false,
      containerWidth: 0,
      containerHeight: 0,
      scrollPosition: 0,
      scrollSize: 0
    }
  },

  computed: {
    thumbHidden () {
      return this.scrollSize <= this.containerSize || (!this.active && !this.hover)
    },
    thumbSize () {
      return Math.round(between(this.containerSize * this.containerSize / this.scrollSize, 50, this.containerSize))
    },
    style () {
      const pos = this.scrollPercentage * (this.containerSize - this.thumbSize)
      return Object.assign({}, this.thumbStyle,
        this.horisontal
          ? {
            left: `${pos}px`,
            width: `${this.thumbSize}px` }
          : {
            top: `${pos}px`,
            height: `${this.thumbSize}px`
          })
    },
    mainStyle () {
      return this.thumbHidden ? this.contentStyle : this.contentActiveStyle
    },
    scrollPercentage () {
      const p = between(this.scrollPosition / (this.scrollSize - this.containerSize), 0, 1)
      return Math.round(p * 10000) / 10000
    },
    direction () {
      return this.horisontal ? 'right' : 'down'
    },
    containerSize () {
      return this.horisontal ? this.containerWidth : this.containerHeight
    }
  },

  methods: {
    setScrollPosition (offset, duration) {
      if (this.horisontal) {
        setHorisontalScrollPosition(this.$refs.target, offset, duration)
      }
      else {
        setScrollPosition(this.$refs.target, offset, duration)
      }
    },

    __updateContainer ({ height, width }) {
      if (this.containerWidth !== width) {
        this.containerWidth = width
        this.__setActive(true, true)
      }
      if (this.containerHeight !== height) {
        this.containerHeight = height
        this.__setActive(true, true)
      }
    },

    __updateScroll ({ position }) {
      if (this.scrollPosition !== position) {
        this.scrollPosition = position
        this.__setActive(true, true)
      }
    },

    __updateScrollSize ({ height, width }) {
      if (this.horisontal) {
        if (this.scrollSize !== width) {
          this.scrollSize = width
          this.__setActive(true, true)
        }
      }
      else {
        if (this.scrollSize !== height) {
          this.scrollSize = height
          this.__setActive(true, true)
        }
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

      const multiplier = (this.scrollSize - this.containerSize) / (this.containerSize - this.thumbSize)
      const distance = this.horisontal ? e.distance.x : e.distance.y
      const pos = this.refPos + (e.direction === this.direction ? 1 : -1) * distance * multiplier
      this.__setScroll(pos)
    },

    __panContainer (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition
        this.__setActive(true, true)
      }
      if (e.isFinal) {
        this.__setActive(false)
      }

      const distance = this.horisontal ? e.distance.x : e.distance.y
      const pos = this.refPos + (e.direction === this.direction ? -1 : 1) * distance
      this.__setScroll(pos)

      if (pos > 0 && pos + this.containerSize < this.scrollSize) {
        e.evt.preventDefault()
      }
    },

    __mouseWheel (e) {
      if (this.horisontal) {
        return
      }
      const el = this.$refs.target
      el.scrollTop += getMouseWheelDistance(e).y
      if (el.scrollTop > 0 && el.scrollTop + this.containerSize < this.scrollSize) {
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
    },

    __setScroll (scroll) {
      if (this.horisontal) {
        this.$refs.target.scrollLeft = scroll
      }
      else {
        this.$refs.target.scrollTop = scroll
      }
    }
  },

  render (h) {
    if (!this.$q.platform.is.desktop) {
      return h('div', {
        staticClass: 'q-scroll-area relative-position',
        style: this.contentStyle
      }, [
        h('div', {
          ref: 'target',
          staticClass: 'scroll relative-position fit'
        }, slot(this, 'default'))
      ])
    }

    return h('div', {
      staticClass: 'q-scrollarea relative-position',
      on: {
        mouseenter: () => { this.hover = true },
        mouseleave: () => { this.hover = false }
      }
    }, [
      h('div', {
        ref: 'target',
        staticClass: 'scroll relative-position overflow-hidden fit',
        on: {
          wheel: this.__mouseWheel
        },
        directives: [{
          name: 'touch-pan',
          modifiers: {
            vertical: !this.horisontal,
            horisontal: this.horisontal,
            mightPrevent: true
          },
          value: this.__panContainer
        }]
      }, [
        h('div', {
          staticClass: 'absolute',
          style: this.mainStyle,
          class: {
            'full-height': this.horisontal,
            'full-width': !this.horisontal }
        }, [
          h(QResizeObserver, {
            on: { resize: this.__updateScrollSize }
          }),
          slot(this, 'default')
        ]),
        h(QScrollObserver, {
          props: { horisontal: this.horisontal },
          on: { scroll: this.__updateScroll }
        })
      ]),

      h(QResizeObserver, {
        on: { resize: this.__updateContainer }
      }),

      h('div', {
        staticClass: 'q-scrollarea__thumb',
        style: this.style,
        class: {
          'q-scrollarea__thumb--invisible': this.thumbHidden,
          'q-scrollarea__thumb--h absolute-bottom': this.horisontal,
          'q-scrollarea__thumb--v absolute-right': !this.horisontal
        },
        directives: [{
          name: 'touch-pan',
          modifiers: {
            vertical: !this.horisontal,
            horisontal: this.horisontal,
            prevent: true,
            mouse: true,
            mouseAllDir: true,
            mousePrevent: true
          },
          value: this.__panThumb
        }]
      })
    ])
  }
})
