import { between } from '../../utils/format.js'
import { getMouseWheelDistance } from '../../utils/event.js'
import { setScrollPosition } from '../../utils/scroll.js'
import QResizeObservable from '../observables/QResizeObservable.js'
import QScrollObservable from '../observables/QScrollObservable.js'
import TouchPan from '../../directives/touch-pan.js'

export default {
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
      return Object.assign({}, this.thumbStyle, {
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
    setScrollPosition (offset, duration) {
      setScrollPosition(this.$refs.target, offset, duration)
    },
    __updateContainer ({ height }) {
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
    __updateScrollHeight ({ height }) {
      if (this.scrollHeight !== height) {
        this.scrollHeight = height
        this.__setActive(true, true)
      }
    },
    __panThumb (e) {
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
      el.scrollTop += getMouseWheelDistance(e).y
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
        }, this.$slots.default)
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
            vertical: true,
            noMouse: true,
            mightPrevent: true
          },
          value: this.__panContainer
        }]
      }, [
        h('div', {
          staticClass: 'absolute full-width',
          style: this.mainStyle
        }, [
          h(QResizeObservable, {
            on: { resize: this.__updateScrollHeight }
          }),
          this.$slots.default
        ]),
        h(QScrollObservable, {
          on: { scroll: this.__updateScroll }
        })
      ]),

      h(QResizeObservable, {
        on: { resize: this.__updateContainer }
      }),

      h('div', {
        staticClass: 'q-scrollarea-thumb absolute-right',
        style: this.style,
        'class': { 'invisible-thumb': this.thumbHidden },
        directives: [{
          name: 'touch-pan',
          modifiers: {
            vertical: true,
            prevent: true
          },
          value: this.__panThumb
        }]
      })
    ])
  }
}
