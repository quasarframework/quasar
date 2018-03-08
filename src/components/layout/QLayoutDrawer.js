import TouchPan from '../../directives/touch-pan'
import { css, cssTransform } from '../../utils/dom'
import { between } from '../../utils/format'
import { QResizeObservable } from '../observables'
import ModelToggleMixin from '../../mixins/model-toggle'

const
  bodyClassBelow = 'with-layout-drawer-opened',
  bodyClassAbove = 'with-layout-drawer-opened-above',
  duration = 150

export default {
  name: 'QLayoutDrawer',
  inject: {
    layout: {
      default () {
        console.error('QLayoutDrawer needs to be child of QLayout')
      }
    }
  },
  mixins: [ModelToggleMixin],
  directives: {
    TouchPan
  },
  props: {
    overlay: Boolean,
    side: {
      type: String,
      default: 'left',
      validator: v => ['left', 'right'].includes(v)
    },
    breakpoint: {
      type: Number,
      default: 992
    },
    behavior: {
      type: String,
      validator: v => ['default', 'desktop', 'mobile'].includes(v),
      default: 'default'
    },
    contentStyle: Object,
    contentClass: [String, Object, Array],
    noSwipeOpen: Boolean,
    noSwipeClose: Boolean
  },
  data () {
    const
      largeScreenState = this.value !== void 0 ? this.value : true,
      showing = this.behavior !== 'mobile' && this.breakpoint < this.layout.width && !this.overlay
        ? largeScreenState
        : false

    if (this.value !== void 0 && this.value !== showing) {
      this.$emit('input', showing)
    }

    return {
      showing,
      belowBreakpoint: (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= this.layout.width)
      ),
      largeScreenState,
      mobileOpened: false,

      size: 300
    }
  },
  watch: {
    belowBreakpoint (val, old) {
      if (this.mobileOpened) {
        return
      }

      if (val) { // from lg to xs
        if (!this.overlay) {
          this.largeScreenState = this.showing
        }
        // ensure we close it for small screen
        this.hide()
      }
      else if (!this.overlay) { // from xs to lg
        this[this.largeScreenState ? 'show' : 'hide']()
      }
    },
    behavior (val) {
      this.__updateLocal('belowBreakpoint', (
        val === 'mobile' ||
        (val !== 'desktop' && this.breakpoint >= this.layout.width)
      ))
    },
    breakpoint (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && val >= this.layout.width)
      ))
    },
    'layout.width' (val) {
      this.__updateLocal('belowBreakpoint', (
        this.behavior === 'mobile' ||
        (this.behavior !== 'desktop' && this.breakpoint >= val)
      ))
    },
    offset (val) {
      this.__update('offset', val)
    },
    onScreenOverlay () {
      if (this.animateOverlay) {
        this.layout.__animate()
      }
    },
    onLayout (val) {
      this.__update('space', val)
      this.layout.__animate()
    },
    $route () {
      if (this.mobileOpened || this.onScreenOverlay) {
        this.hide()
      }
    }
  },
  computed: {
    rightSide () {
      return this.side === 'right'
    },
    offset () {
      return this.showing && !this.mobileOpened && !this.overlay
        ? this.size
        : 0
    },
    fixed () {
      return this.overlay || this.layout.view.indexOf(this.rightSide ? 'R' : 'L') > -1
    },
    onLayout () {
      return this.showing && !this.mobileView && !this.overlay
    },
    onScreenOverlay () {
      return this.showing && !this.mobileView && this.overlay
    },
    backdropClass () {
      return {
        'no-pointer-events': !this.showing
      }
    },
    mobileView () {
      return this.belowBreakpoint || this.mobileOpened
    },
    headerSlot () {
      return this.overlay
        ? false
        : (this.rightSide
          ? this.layout.rows.top[2] === 'r'
          : this.layout.rows.top[0] === 'l'
        )
    },
    footerSlot () {
      return this.overlay
        ? false
        : (this.rightSide
          ? this.layout.rows.bottom[2] === 'r'
          : this.layout.rows.bottom[0] === 'l'
        )
    },
    belowClass () {
      return {
        'fixed': true,
        'on-top': true,
        'top-padding': true
      }
    },
    aboveClass () {
      // const onScreen = this.onLayout || this.onScreenOverlay
      return {
        'fixed': this.fixed || !this.onLayout,
        'top-padding': this.headerSlot
      }
    },
    aboveStyle () {
      const css = {}

      if (this.layout.header.space && !this.headerSlot) {
        if (this.fixed) {
          css.top = `${this.layout.header.offset}px`
        }
        else if (this.layout.header.space) {
          css.top = `${this.layout.header.size}px`
        }
      }

      if (this.layout.footer.space && !this.footerSlot) {
        if (this.fixed) {
          css.bottom = `${this.layout.footer.offset}px`
        }
        else if (this.layout.footer.space) {
          css.bottom = `${this.layout.footer.size}px`
        }
      }

      return css
    },
    computedStyle () {
      return [this.contentStyle, this.mobileView ? '' : this.aboveStyle]
    },
    computedClass () {
      return [this.contentClass, this.mobileView ? this.belowClass : this.aboveClass]
    },
    stateDirection () {
      return (this.$q.i18n.rtl ? -1 : 1) * (this.rightSide ? 1 : -1)
    }
  },
  render (h) {
    const child = []

    if (this.mobileView) {
      if (!this.noSwipeOpen) {
        child.push(h('div', {
          staticClass: `q-layout-drawer-opener fixed-${this.side}`,
          directives: [{
            name: 'touch-pan',
            modifiers: { horizontal: true },
            value: this.__openByTouch
          }]
        }))
      }
      child.push(h('div', {
        ref: 'backdrop',
        staticClass: 'fullscreen q-layout-backdrop',
        'class': this.backdropClass,
        on: { click: this.hide },
        directives: [{
          name: 'touch-pan',
          modifiers: { horizontal: true },
          value: this.__closeByTouch
        }]
      }))
    }

    return h('div', { staticClass: 'q-drawer-container' }, child.concat([
      h('aside', {
        ref: 'content',
        staticClass: `q-layout-drawer q-layout-drawer-${this.side} scroll q-layout-transition`,
        'class': this.computedClass,
        style: this.computedStyle,
        attrs: this.$attrs,
        listeners: this.$listeners,
        directives: this.mobileView && !this.noSwipeClose ? [{
          name: 'touch-pan',
          modifiers: { horizontal: true },
          value: this.__closeByTouch
        }] : null
      }, [
        this.$slots.default,
        h(QResizeObservable, {
          props: { debounce: 0 },
          on: { resize: this.__onResize }
        })
      ])
    ]))
  },
  created () {
    this.layout.instances[this.side] = this
    if (this.onLayout) {
      this.__update('space', true)
    }

    this.$nextTick(() => {
      this.animateOverlay = true
    })
  },
  mounted () {
    if (!this.showing) {
      this.applyPosition(this.stateDirection * this.size)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    if (this.layout.instances[this.side] === this) {
      this.layout.instances[this.side] = null
      this.__update('size', 0)
      this.__update('offset', 0)
      this.__update('space', false)
    }
  },
  methods: {
    applyPosition (position) {
      css(this.$refs.content, cssTransform(`translateX(${position}px)`))
    },
    applyBackdrop (x) {
      this.$refs.backdrop && css(this.$refs.backdrop, { backgroundColor: `rgba(0,0,0,${x * 0.4})` })
    },
    __openByTouch (evt) {
      if (!this.belowBreakpoint) {
        return
      }
      const
        width = this.size,
        position = between(evt.distance.x, 0, width)

      if (evt.isFinal) {
        const opened = position >= Math.min(75, width)
        this.$refs.content.classList.remove('no-transition')
        if (opened) {
          this.show()
        }
        else {
          this.applyBackdrop(0)
          this.applyPosition(this.stateDirection * width)
        }
        return
      }

      this.applyPosition(
        (this.$q.i18n.rtl ? !this.rightSide : this.rightSide)
          ? Math.max(width - position, 0)
          : Math.min(0, position - width)
      )
      this.applyBackdrop(
        between(position / width, 0, 1)
      )

      if (evt.isFirst) {
        document.body.classList.add(bodyClassBelow)
        this.$refs.content.classList.add('no-transition')
      }
    },
    __closeByTouch (evt) {
      if (!this.mobileOpened) {
        return
      }

      const
        width = this.size,
        dir = evt.direction === this.side,
        position = (this.$q.i18n.rtl ? !dir : dir)
          ? between(evt.distance.x, 0, width)
          : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) < Math.min(75, width)
        this.$refs.content.classList.remove('no-transition')
        if (opened) {
          this.applyBackdrop(1)
          this.applyPosition(0)
        }
        else {
          this.hide()
        }
        return
      }

      this.applyPosition(this.stateDirection * position)
      this.applyBackdrop(between(1 - position / width, 0, 1))

      if (evt.isFirst) {
        this.$refs.content.classList.add('no-transition')
      }
    },
    __show () {
      if (this.belowBreakpoint) {
        const otherSide = this.layout.instances[this.rightSide ? 'left' : 'right']
        if (otherSide && otherSide.mobileOpened) {
          otherSide.hide()
        }
        this.mobileOpened = true
        this.applyBackdrop(1)
      }

      this.applyPosition(0)
      document.body.classList.add(this.belowBreakpoint ? bodyClassBelow : bodyClassAbove)

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.showPromise) {
          this.showPromise.then(() => {
            document.body.classList.remove(bodyClassAbove)
          })
          this.showPromiseResolve()
        }
      }, duration)
    },
    __hide () {
      this.mobileOpened = false
      this.applyPosition((this.$q.i18n.rtl ? -1 : 1) * (this.rightSide ? 1 : -1) * this.size)
      this.applyBackdrop(0)

      document.body.classList.remove(bodyClassAbove)
      document.body.classList.remove(bodyClassBelow)

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hidePromise && this.hidePromiseResolve()
      }, duration)
    },

    __onResize ({ width }) {
      this.__update('size', width)
      this.__updateLocal('size', width)
    },
    __update (prop, val) {
      if (this.layout[this.side][prop] !== val) {
        this.layout[this.side][prop] = val
      }
    },
    __updateLocal (prop, val) {
      if (this[prop] !== val) {
        this[prop] = val
      }
    }
  }
}
