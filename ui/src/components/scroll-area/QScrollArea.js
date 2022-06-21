import Vue from 'vue'

import QResizeObserver from '../resize-observer/QResizeObserver.js'
import QScrollObserver from '../scroll-observer/QScrollObserver.js'

import TouchPan from '../../directives/TouchPan.js'

import { between } from '../../utils/format.js'
import { setVerticalScrollPosition, setHorizontalScrollPosition } from '../../utils/scroll.js'
import { mergeSlot } from '../../utils/slot.js'
import cache from '../../utils/cache.js'
import debounce from '../../utils/debounce.js'

import DarkMixin from '../../mixins/dark.js'
import { ariaHidden } from '../../mixins/attrs'

const getMinThumbSize = size => (size >= 250 ? 50 : Math.ceil(size / 5))

const axisList = [ 'vertical', 'horizontal' ]
const dirProps = {
  vertical: { offset: 'offsetY', scroll: 'scrollTop', dir: 'down', dist: 'y' },
  horizontal: { offset: 'offsetX', scroll: 'scrollLeft', dir: 'right', dist: 'x' }
}

export default Vue.extend({
  name: 'QScrollArea',

  mixins: [ DarkMixin ],

  directives: {
    TouchPan
  },

  props: {
    thumbStyle: Object,
    verticalThumbStyle: Object,
    horizontalThumbStyle: Object,

    barStyle: [ Array, String, Object ],
    verticalBarStyle: [ Array, String, Object ],
    horizontalBarStyle: [ Array, String, Object ],

    contentStyle: [ Array, String, Object ],
    contentActiveStyle: [ Array, String, Object ],

    delay: {
      type: [ String, Number ],
      default: 1000
    },

    visible: {
      type: Boolean,
      default: null
    },

    horizontal: Boolean,

    tabindex: [ String, Number ]
  },

  data () {
    return {
      // state management
      tempShowing: false,
      panning: false,
      hover: false,

      // other...
      container: {
        vertical: 0,
        horizontal: 0
      },

      scroll: {
        vertical: {
          position: 0,
          size: 0
        },

        horizontal: {
          position: 0,
          size: 0
        }
      }
    }
  },

  computed: {
    classes () {
      return 'q-scrollarea' +
        (this.isDark === true ? ' q-scrollarea--dark' : '')
    },

    verticalScrollPercentage () {
      const diff = this.scroll.vertical.size - this.container.vertical
      if (diff <= 0) { return 0 }
      const p = between(this.scroll.vertical.position / diff, 0, 1)
      return Math.round(p * 10000) / 10000
    },

    horizontalScrollPercentage () {
      const diff = this.scroll.horizontal.size - this.container.horizontal
      if (diff <= 0) { return 0 }
      const p = between(this.scroll.horizontal.position / diff, 0, 1)
      return Math.round(p * 10000) / 10000
    },

    verticalThumbHidden () {
      return (
        (this.visible === null ? this.hover : this.visible) !== true &&
        this.tempShowing === false &&
        this.panning === false
      ) || this.scroll.vertical.size <= this.container.vertical + 1
    },

    horizontalThumbHidden () {
      return (
        (this.visible === null ? this.hover : this.visible) !== true &&
        this.tempShowing === false &&
        this.panning === false
      ) || this.scroll.horizontal.size <= this.container.horizontal + 1
    },

    verticalThumbStart () {
      return this.verticalScrollPercentage * (this.container.vertical - this.verticalThumbSize)
    },

    horizontalThumbStart () {
      return this.horizontalScrollPercentage * (this.container.horizontal - this.horizontalThumbSize)
    },

    verticalThumbSize () {
      return Math.round(
        between(
          this.container.vertical * this.container.vertical / this.scroll.vertical.size,
          getMinThumbSize(this.container.vertical),
          this.container.vertical
        )
      )
    },

    horizontalThumbSize () {
      return Math.round(
        between(
          this.container.horizontal * this.container.horizontal / this.scroll.horizontal.size,
          getMinThumbSize(this.container.horizontal),
          this.container.horizontal
        )
      )
    },

    verticalStyle () {
      return {
        ...this.thumbStyle,
        ...this.verticalThumbStyle,
        top: `${this.verticalThumbStart}px`,
        height: `${this.verticalThumbSize}px`
      }
    },

    horizontalStyle () {
      return {
        ...this.thumbStyle,
        ...this.horizontalThumbStyle,
        left: `${this.horizontalThumbStart}px`,
        width: `${this.horizontalThumbSize}px`
      }
    },

    verticalThumbClass () {
      return 'q-scrollarea__thumb q-scrollarea__thumb--v absolute-right' +
        (this.verticalThumbHidden === true ? ' q-scrollarea__thumb--invisible' : '')
    },

    horizontalThumbClass () {
      return 'q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom' +
        (this.horizontalThumbHidden === true ? ' q-scrollarea__thumb--invisible' : '')
    },

    verticalBarClass () {
      return 'q-scrollarea__bar q-scrollarea__bar--v absolute-right' +
        (this.verticalThumbHidden === true ? ' q-scrollarea__bar--invisible' : '')
    },

    horizontalBarClass () {
      return 'q-scrollarea__bar q-scrollarea__bar--h absolute-bottom' +
        (this.horizontalThumbHidden === true ? ' q-scrollarea__bar--invisible' : '')
    },

    scrollComputed () {
      return {
        vertical: {
          ...this.scroll.vertical,
          percentage: this.verticalScrollPercentage,
          thumbHidden: this.verticalThumbHidden,
          thumbStart: this.verticalThumbStart,
          thumbSize: this.verticalThumbSize,
          style: this.verticalStyle,
          thumbClass: this.verticalThumbClass,
          barClass: this.verticalBarClass
        },
        horizontal: {
          ...this.scroll.horizontal,
          percentage: this.horizontalScrollPercentage,
          thumbHidden: this.horizontalThumbHidden,
          thumbStart: this.horizontalThumbStart,
          thumbSize: this.horizontalThumbSize,
          style: this.horizontalStyle,
          thumbClass: this.horizontalThumbClass,
          barClass: this.horizontalBarClass
        }
      }
    },

    mainStyle () {
      return this.verticalThumbHidden === true && this.horizontalThumbHidden === true
        ? this.contentStyle
        : this.contentActiveStyle
    },

    verticalThumbDirectives () {
      return [{
        name: 'touch-pan',
        modifiers: {
          vertical: true,
          prevent: true,
          mouse: true,
          mouseAllDir: true
        },
        value: e => { this.__panThumb(e, 'vertical') }
      }]
    },

    horizontalThumbDirectives () {
      return [{
        name: 'touch-pan',
        modifiers: {
          horizontal: true,
          prevent: true,
          mouse: true,
          mouseAllDir: true
        },
        value: e => { this.__panThumb(e, 'horizontal') }
      }]
    },

    scrollAttrs () {
      if (this.tabindex !== void 0) {
        return { tabindex: this.tabindex }
      }
    }
  },

  methods: {
    getScrollTarget () {
      return this.$refs.target
    },

    getScroll () {
      const info = {}

      axisList.forEach(axis => {
        const data = this.scrollComputed[ axis ]

        info[ axis + 'Position' ] = data.position
        info[ axis + 'Percentage' ] = data.percentage
        info[ axis + 'Size' ] = data.size
        info[ axis + 'ContainerSize' ] = this.container[ axis ]
      })

      return info
    },

    getScrollPosition (axis) {
      if (axis === 'both') {
        return {
          top: this.scroll.vertical.position,
          left: this.scroll.horizontal.position
        }
      }

      if (axisList.includes(axis) !== true) {
        axis = this.horizontal === true ? 'horizontal' : 'vertical'
      }

      return this.scroll[axis].position
    },

    getScrollPercentage (axis) {
      if (axis === 'both') {
        return {
          top: this.verticalScrollPercentage,
          left: this.horizontalScrollPercentage
        }
      }

      if (axisList.includes(axis) !== true) {
        axis = this.horizontal === true ? 'horizontal' : 'vertical'
      }

      return this[`${axis}ScrollPercentage`]
    },

    setScrollPosition (axis, offset, duration) {
      if (axisList.includes(axis) === false) {
        if (isNaN(axis) === true) {
          console.error('[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)')
          return
        }

        [axis, offset, duration] = [this.horizontal === true ? 'horizontal' : 'vertical', axis, offset]
      }

      const fn = axis === 'vertical'
        ? setVerticalScrollPosition
        : setHorizontalScrollPosition

      fn(this.$refs.target, offset, duration)
    },

    setScrollPercentage (axis, percentage, duration) {
      if (axisList.includes(axis) === false) {
        if (isNaN(axis) === true) {
          console.error('[QScrollArea]: wrong first param of setScrollPercentage (vertical/horizontal)')
          return
        }

        [axis, percentage, duration] = [this.horizontal === true ? 'horizontal' : 'vertical', axis, percentage]
      }

      this.setScrollPosition(
        axis,
        percentage * (this.scroll[axis].size - this.container[axis]),
        duration
      )
    },

    __updateContainer ({ height, width }) {
      let change = false

      if (this.container.vertical !== height) {
        this.container.vertical = height
        change = true
      }

      if (this.container.horizontal !== width) {
        this.container.horizontal = width
        change = true
      }

      change === true && this.__startTimer()
    },

    __updateVerticalScroll ({ position }) {
      if (this.scroll.vertical.position !== position) {
        this.scroll.vertical.position = position
        this.__startTimer()
      }
    },

    __updateHorizontalScroll ({ position }) {
      if (this.scroll.horizontal.position !== position) {
        this.scroll.horizontal.position = position
        this.__startTimer()
      }
    },

    __updateScrollSize ({ height, width }) {
      let change = false

      if (this.scroll.horizontal.size !== width) {
        this.scroll.horizontal.size = width
        change = true
      }

      if (this.scroll.vertical.size !== height) {
        this.scroll.vertical.size = height
        change = true
      }

      change === true && this.__startTimer()
    },

    __panThumb (e, axis) {
      const data = this.scrollComputed[ axis ]

      if (e.isFinal === true) {
        if (this.panning !== true) {
          return
        }

        this.panning = false
      }
      else if (e.isFirst === true) {
        if (data.thumbHidden === true) {
          return
        }

        this.refPos = data.position
        this.panning = true
      }
      else if (this.panning !== true) {
        return
      }

      const dProp = dirProps[ axis ]
      const containerSize = this.container[axis]

      const multiplier = (data.size - containerSize) / (containerSize - data.thumbSize)
      const distance = e.distance[dProp.dist]
      const pos = this.refPos + (e.direction === dProp.dir ? 1 : -1) * distance * multiplier

      this.__setScroll(pos, axis)
    },

    __mouseDown (evt, axis) {
      const data = this.scrollComputed[ axis ]

      if (data.thumbHidden !== true) {
        const offset = evt[ dirProps[ axis ].offset ]
        if (offset < data.thumbStart || offset > data.thumbStart + data.thumbSize) {
          const pos = offset - data.thumbSize / 2
          this.__setScroll(pos / this.container[ axis ] * data.size, axis)
        }

        const ref = axis === 'vertical' ? this.$refs.verticalThumb : this.$refs.horizontalThumb
        // activate thumb pan
        if (ref !== void 0) {
          ref.dispatchEvent(new MouseEvent(evt.type, evt))
        }
      }
    },

    __verticalMouseDown (evt) {
      this.__mouseDown(evt, 'vertical')
    },

    __horizontalMouseDown (evt) {
      this.__mouseDown(evt, 'horizontal')
    },

    __startTimer () {
      if (this.tempShowing === true) {
        clearTimeout(this.timer)
      }
      else {
        this.tempShowing = true
      }

      this.timer = setTimeout(() => { this.tempShowing = false }, this.delay)
      this.$listeners.scroll !== void 0 && this.__emitScroll()
    },

    __setScroll (offset, axis) {
      this.$refs.target[ dirProps[ axis ].scroll ] = offset
    },

    __mouseEnter () {
      this.hover = true
    },

    __mouseLeave () {
      this.hover = false
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      on: cache(this, 'desk', {
        mouseenter: this.__mouseEnter,
        mouseleave: this.__mouseLeave
      })
    }, [
      h('div', {
        ref: 'target',
        staticClass: 'q-scrollarea__container scroll relative-position fit hide-scrollbar',
        attrs: this.scrollAttrs
      }, [
        h('div', {
          staticClass: 'q-scrollarea__content absolute',
          style: this.mainStyle
        }, mergeSlot([
          h(QResizeObserver, {
            props: { debounce: 0 },
            on: cache(this, 'resizeIn', { resize: this.__updateScrollSize })
          })
        ], this, 'default')),

        h(QScrollObserver, {
          on: cache(this, 'scrollV', { scroll: this.__updateVerticalScroll })
        }),

        h(QScrollObserver, {
          props: { horizontal: true },
          on: cache(this, 'scrollH', { scroll: this.__updateHorizontalScroll })
        })
      ]),

      h(QResizeObserver, {
        props: { debounce: 0 },
        on: cache(this, 'resizeOut', { resize: this.__updateContainer })
      }),

      h('div', {
        class: this.verticalBarClass,
        style: [ this.barStyle, this.verticalBarStyle ],
        attrs: ariaHidden,
        on: cache(this, 'barV', {
          mousedown: this.__verticalMouseDown
        })
      }),

      h('div', {
        class: this.horizontalBarClass,
        style: [ this.barStyle, this.horizontalBarStyle ],
        attrs: ariaHidden,
        on: cache(this, 'barH', {
          mousedown: this.__horizontalMouseDown
        })
      }),

      h('div', {
        ref: 'verticalThumb',
        class: this.verticalThumbClass,
        style: this.verticalStyle,
        attrs: ariaHidden,
        directives: this.verticalThumbDirectives
      }),

      h('div', {
        ref: 'horizontalThumb',
        class: this.horizontalThumbClass,
        style: this.horizontalStyle,
        attrs: ariaHidden,
        directives: this.horizontalThumbDirectives
      })
    ])
  },

  created () {
    // we have lots of listeners, so
    // ensure we're not emitting same info
    // multiple times
    this.__emitScroll = debounce(() => {
      const info = this.getScroll()
      info.ref = this
      this.$emit('scroll', info)
    }, 0)
  },

  activated () {
    if (this.__scrollPosition === void 0) { return }

    const scrollTarget = this.getScrollTarget()

    if (scrollTarget !== void 0) {
      setHorizontalScrollPosition(scrollTarget, this.__scrollPosition.left)
      setVerticalScrollPosition(scrollTarget, this.__scrollPosition.top)
    }
  },

  deactivated () {
    this.__scrollPosition = this.getScrollPosition('both')
  },

  beforeDestroy () {
    this.__emitScroll.cancel()
    clearTimeout(this.timer)
  }
})
