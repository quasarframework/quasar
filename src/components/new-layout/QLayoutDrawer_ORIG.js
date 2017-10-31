import TouchPan from '../../directives/touch-pan'
import { cssTransform } from '../../utils/dom'
import { between } from '../../utils/format'
import { QResizeObservable } from '../observables'

const bodyClass = 'with-layout-drawer-opened'

export default {
  name: 'q-layout-drawer',
  inject: ['layout'],
  directives: {
    TouchPan
  },
  props: {
    value: Boolean,
    rightSide: Boolean,
    overlay: Boolean,
    breakpoint: {
      type: Number,
      default: 992
    }
  },
  data () {
    const belowBreakpoint = this.breakpoint >= this.layout.width
    return {
      belowBreakpoint,
      model: belowBreakpoint
        ? false
        : this.value,

      size: 300,
      inTransit: false,
      position: 0,
      percentage: 0
    }
  },
  watch: {
    value (val) {
      console.log('value received', val)
      if (this.model !== val) {
        this.model = val
      }
    },
    offset (val) {
      this.__update('offset', val)
    },
    model: {
      handler (val) {
        console.log('model change', val)
        if (this.value !== val) {
          this.$emit('input', val)
        }
        if (this.belowBreakpoint) {
          if (val) {
            this.show()
          }
          else {
            this.hide()
          }
        }
      }
    },
    breakpoint () {
      this.__updateLocal('belowBreakpoint', this.breakpoint > this.layout.width)
    },
    'layout.width' () {
      this.__updateLocal('belowBreakpoint', this.breakpoint > this.layout.width)
    },
    belowBreakpoint (val) {
      console.log('belowBreakpoint', val)
      this.model = !val
      if (!val) {
        this.percentage = 0
      }
    },
    onLayout (val) {
      console.log('onLayout changed to', val)
      this.__update('space', val)
      this.layout.__animate()
    }
  },
  computed: {
    side () {
      return this.rightSide ? 'right' : 'left'
    },
    offset () {
      if (this.model) {
        return this.size
      }
    },
    fixed () {
      return this.layout.view.indexOf(this.rightSide ? 'R' : 'L') > -1
    },
    onLayout () {
      return !this.overlay && !this.belowBreakpoint && this.model
    },
    belowClass () {
      return {
        'fixed': true,
        'on-top': this.inTransit || this.model,
        'on-layout': this.model,
        'off-layout': !this.model,
        'transition-generic': !this.inTransit,
        'top-padding': this.fixed || (this.rightSide ? this.layout.rows.top[2] === 'r' : this.layout.rows.top[0] === 'l')
      }
    },
    belowStyle () {
      if (this.inTransit) {
        return cssTransform(`translateX(${this.position}px)`)
      }
    },
    aboveClass () {
      const onLayout = this.onLayout || (this.model && this.overlay)
      return {
        'off-layout': !onLayout,
        'on-layout': onLayout,
        'fixed': this.overlay || this.fixed || !this.onLayout,
        'top-padding': this.fixed || (this.rightSide ? this.layout.rows.top[2] === 'r' : this.layout.rows.top[0] === 'l')
      }
    },
    aboveStyle () {
      const
        view = this.layout.rows,
        css = {}

      if (this.layout.header.space && this.rightSide ? view.top[2] !== 'r' : view.top[0] !== 'l') {
        if (this.fixed) {
          css.top = `${this.layout.header.offset}px`
        }
        else if (this.layout.header.space) {
          css.top = `${this.layout.header.size}px`
        }
      }

      if (this.layout.footer.space && this.rightSide ? view.bottom[2] !== 'r' : view.bottom[0] !== 'l') {
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
      return this.belowBreakpoint ? this.belowStyle : this.aboveStyle
    },
    computedClass () {
      return this.belowBreakpoint ? this.belowClass : this.aboveClass
    }
  },
  render (h) {
    console.log(`drawer ${this.side} render`)
    const child = []

    if (this.belowBreakpoint) {
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
        'class': {
          'transition-generic': !this.inTransit,
          'no-pointer-events': !this.inTransit && !this.model
        },
        style: {
          opacity: this.percentage
        },
        on: { click: this.hide },
        directives: [{
          name: 'touch-pan',
          modifier: { horizontal: true },
          value: this.__closeByTouch
        }]
      }))
    }

    return h('div', { staticClass: 'q-drawer-container q-layout-transition' }, child.concat([
      h('aside', {
        staticClass: `q-layout-drawer q-layout-drawer-${this.side} scroll`,
        'class': this.computedClass,
        style: this.computedStyle,
        directives: this.belowBreakpoint ? [{
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
    if (this.value !== this.model) {
      this.$emit('input', this.model)
    }
  },
  destroyed () {
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
        document.body.classList.add(bodyClass)
        this.inTransit = true
      }
    },
    show (fn) {
      if (!this.belowBreakpoint) {
        this.model = true
        fn && fn()
        return
      }

      if (this.$q.platform.has.popstate) {
        if (!window.history.state) {
          window.history.replaceState({__quasar_layout_overlay: true}, '')
        }
        else {
          window.history.state.__quasar_layout_overlay = true
        }
        let hist = window.history.state || {}
        hist.__quasar_layout_overlay = true
        window.history.replaceState(hist, '')
        window.history.pushState({}, '')
        window.addEventListener('popstate', this.__popState)
      }

      document.body.classList.add(bodyClass)
      this.model = true
      this.percentage = 1
      fn && fn()
    },
    __closeByTouch (evt) {
      if (!this.belowBreakpoint) {
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
    hide (fn) {
      if (!this.belowBreakpoint) {
        this.model = false
        if (typeof fn === 'function') {
          fn()
        }
        return
      }

      document.body.classList.remove(bodyClass)
      if (this.$q.platform.has.popstate) {
        this.popStateCallback = fn
        if (window.history.state && !window.history.state.__quasar_layout_overlay) {
          window.history.go(-1)
        }
      }
      else {
        this.__hideSmall(fn)
      }
    },
    __hideSmall (fn) {
      this.model = false
      this.percentage = 0
      if (typeof fn === 'function') {
        setTimeout(fn, 370)
      }
    },
    __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_layout_overlay) {
        window.removeEventListener('popstate', this.__popState)
        this.__hideSmall(this.popStateCallback)
        this.popStateCallback = null
      }
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
