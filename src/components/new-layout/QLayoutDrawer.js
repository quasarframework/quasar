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
    breakpoint: {
      type: Number,
      default: 992
    }
  },
  data () {
    return {
      model: this.breakpoint < this.layout.width
        ? this.value
        : false,

      inTransit: false,
      position: 0,
      percentage: 0,

      backdropTouchEvent: false
    }
  },
  watch: {
    value (val) {
      console.log('value received', val)
      if (this.model !== val) {
        this.model = val
      }
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
    belowBreakpoint (val) {
      console.log('belowBreakpoint', val)
      this.model = !val
      if (!val) {
        this.percentage = 0
      }
    },
    onLayout: {
      handler (val) {
        console.log('onLayout changed to', val)
        this.__update('space', val)
      },
      immediate: true
    }
  },
  computed: {
    side () {
      return this.rightSide ? 'right' : 'left'
    },
    belowBreakpoint () {
      return this.breakpoint > this.layout.width
    },
    onLayout () {
      return this.model && !this.belowBreakpoint
    },
    belowClass () {
      return {
        'fixed': true,
        'on-top': true,
        'transition-generic': !this.inTransit,
        'top-padding': this.layout.fixed[this.side] || (this.rightSide ? this.layout.rows.top[2] === 'r' : this.layout.rows.top[0] === 'l')
      }
    },
    aboveClass () {
      return {
        'on-layout': this.onLayout,
        'transition-drawer': !this.inTransit,
        'fixed': this.layout.fixed[this.side] || !this.onLayout,
        'top-padding': this.layout.fixed[this.side] || (this.rightSide ? this.layout.rows.top[2] === 'r' : this.layout.rows.top[0] === 'l')
      }
    },
    belowStyle () {
      return cssTransform(this.inTransit
        ? `translateX(${this.position}px)`
        : `translateX(${this.model ? 0 : `${this.rightSide ? '' : '-'}100%`})`
      )
    },
    aboveStyle () {
      const
        view = this.layout.rows,
        css = cssTransform(`translateX(${this.onLayout ? 0 : `${this.rightSide ? '' : '-'}100%`})`)

      if (this.layout.header.space && this.rightSide ? view.top[2] !== 'r' : view.top[0] !== 'l') {
        if (this.layout.fixed[this.side]) {
          css.top = `${this.layout.offsetTop}px`
        }
        else if (this.layout.header.space) {
          css.top = `${this.layout.header.size}px`
        }
      }

      if (this.layout.footer.space && this.rightSide ? view.bottom[2] !== 'r' : view.bottom[0] !== 'l') {
        if (this.layout.fixed[this.side]) {
          css.bottom = `${this.layout.offsetBottom}px`
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

    return h('div', child.concat([
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
  mounted () {
    if (this.value !== this.model) {
      this.$emit('input', this.model)
    }
  },
  destroyed () {
    this.layout[this.side].size = 0
    this.layout[this.side].space = false
  },
  methods: {
    __openByTouch (evt) {
      if (!this.belowBreakpoint) {
        return
      }
      const
        side = this.side,
        width = this.layout[side].size,
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
        width = this.layout[this.side].size,
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
    },
    __update (prop, val) {
      if (this.layout[this.side][prop] !== val) {
        this.layout[this.side][prop] = val
      }
    }
  }
}
