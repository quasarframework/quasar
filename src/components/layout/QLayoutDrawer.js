import TouchPan from '../../directives/touch-pan'
import { cssTransform } from '../../utils/dom'
import { between } from '../../utils/format'
import { QResizeObservable } from '../observables'
import ModelToggleMixin from '../../mixins/model-toggle'

const
  bodyClassBelow = 'with-layout-drawer-opened',
  bodyClassAbove = 'with-layout-drawer-opened-above',
  duration = 150

export default {
  name: 'q-layout-drawer',
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
    rightSide: Boolean,
    breakpoint: {
      type: Number,
      default: 992
    },
    behavior: {
      type: String,
      validator: v => ['default', 'desktop', 'mobile'].includes(v),
      default: 'default'
    }
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

      size: 300,
      inTransit: false,
      position: 0,
      percentage: 0
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
      if (this.mobileOpened) {
        this.hide()
        return
      }
      if (this.onScreenOverlay) {
        this.hide()
      }
    }
  },
  computed: {
    side () {
      return this.rightSide ? 'right' : 'left'
    },
    offset () {
      return this.showing && !this.mobileOpened
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
        'q-layout-backdrop-transition': !this.inTransit,
        'no-pointer-events': !this.inTransit && !this.showing
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
    backdropStyle () {
      return { backgroundColor: `rgba(0,0,0,${this.percentage * 0.4})` }
    },
    belowClass () {
      return {
        'fixed': true,
        'on-top': true,
        'on-screen': this.showing,
        'off-screen': !this.showing,
        'transition-generic': !this.inTransit,
        'top-padding': this.fixed || this.headerSlot
      }
    },
    belowStyle () {
      if (this.inTransit) {
        return cssTransform(`translateX(${this.position}px)`)
      }
    },
    aboveClass () {
      const onScreen = this.onLayout || this.onScreenOverlay
      return {
        'off-screen': !onScreen,
        'on-screen': onScreen,
        'fixed': this.fixed || !this.onLayout,
        'top-padding': this.fixed || this.headerSlot
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
      return this.mobileView ? this.belowStyle : this.aboveStyle
    },
    computedClass () {
      return this.mobileView ? this.belowClass : this.aboveClass
    }
  },
  render (h) {
    const child = []

    if (this.mobileView) {
      child.push(h('div', {
        staticClass: `q-layout-drawer-opener fixed-${this.side}`,
        directives: [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__openByTouch
        }]
      }))
      child.push(h('div', {
        staticClass: 'fullscreen q-layout-backdrop',
        'class': this.backdropClass,
        style: this.backdropStyle,
        on: { click: this.hide },
        directives: [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__closeByTouch
        }]
      }))
    }

    return h('div', { staticClass: 'q-drawer-container' }, child.concat([
      h('aside', {
        staticClass: `q-layout-drawer q-layout-drawer-${this.side} scroll q-layout-transition`,
        'class': this.computedClass,
        style: this.computedStyle,
        directives: this.mobileView ? [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__closeByTouch
        }] : null
      }, [
        this.$slots.default,
        h(QResizeObservable, {
          on: { resize: this.__onResize }
        })
      ])
    ]))
  },
  created () {
    if (this.onLayout) {
      this.__update('space', true)
      this.__update('offset', this.offset)
    }

    this.$nextTick(() => {
      this.animateOverlay = true
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.__update('size', 0)
    this.__update('space', false)
  },
  methods: {
    __openByTouch (evt) {
      if (!this.belowBreakpoint) {
        return
      }
      const
        width = this.size,
        position = between(evt.distance.x, 0, width)

      if (evt.isFinal) {
        const opened = position >= Math.min(75, width)
        this.inTransit = false
        if (opened) { this.show() }
        else { this.percentage = 0 }
        return
      }

      this.position = this.rightSide
        ? Math.max(width - position, 0)
        : Math.min(0, position - width)

      this.percentage = between(position / width, 0, 1)

      if (evt.isFirst) {
        document.body.classList.add(bodyClassBelow)
        this.inTransit = true
      }
    },
    __closeByTouch (evt) {
      if (!this.mobileOpened) {
        return
      }
      const
        width = this.size,
        position = evt.direction === this.side
          ? between(evt.distance.x, 0, width)
          : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) < Math.min(75, width)
        this.inTransit = false
        if (opened) { this.percentage = 1 }
        else { this.hide() }
        return
      }

      this.position = (this.rightSide ? 1 : -1) * position
      this.percentage = between(1 - position / width, 0, 1)

      if (evt.isFirst) {
        this.inTransit = true
      }
    },
    __show () {
      if (this.belowBreakpoint) {
        this.mobileOpened = true
        this.percentage = 1
      }

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
      this.percentage = 0
      document.body.classList.remove(bodyClassAbove, bodyClassBelow)

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
