import BtnMixin from './btn-mixin'
import { QSpinner } from '../spinner'
import { between } from '../../utils/format'

export default {
  name: 'QBtn',
  mixins: [BtnMixin],
  props: {
    percentage: Number,
    darkPercentage: Boolean,
    waitForRipple: Boolean,
    repeatTimeout: [Number, Function]
  },
  computed: {
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    },
    events () {
      return this.isDisabled || !this.repeatTimeout
        ? {
          click: this.click,
          keydown: this.__onKeyDown,
          keyup: this.__onKeyUp
        }
        : {
          mousedown: this.__startRepeat,
          touchstart: this.__startRepeat,
          keydown: e => { this.__onKeyDown(e, true) },

          mouseup: this.__endRepeat,
          touchend: this.__endRepeat,
          keyup: e => { this.__onKeyUp(e, true) },

          mouseleave: this.__abortRepeat,
          touchmove: this.__abortRepeat,
          blur: this.__abortRepeat
        }
    }
  },
  data () {
    return {
      repeating: false,
      active: false
    }
  },
  methods: {
    click (e) {
      this.__cleanup()

      const go = () => {
        this.$router[this.replace ? 'replace' : 'push'](this.to)
      }

      const trigger = () => {
        if (this.isDisabled) {
          return
        }

        this.$emit('click', e, go)

        if (this.to !== void 0 && !e.defaultPrevented) {
          go()
        }
      }

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 300)
      }
      else {
        trigger()
      }
    },
    __cleanup () {
      clearTimeout(this.timer)
    },
    __onKeyDown (e, repeat) {
      if (this.type || this.isDisabled || e.keyCode !== 13) {
        return
      }
      this.active = true
      if (repeat) {
        this.__startRepeat(e)
      }
    },
    __onKeyUp (e, repeat) {
      if (!this.active) {
        return
      }
      this.active = false
      if (this.isDisabled || e.keyCode !== 13) {
        return
      }
      this[repeat ? '__endRepeat' : 'click'](e)
    },
    __startRepeat (e) {
      if (this.repeating) {
        return
      }
      const setTimer = () => {
        this.timer = setTimeout(
          trigger,
          typeof this.repeatTimeout === 'function'
            ? this.repeatTimeout(this.repeatCount)
            : this.repeatTimeout
        )
      }
      const trigger = () => {
        if (this.isDisabled) {
          return
        }
        this.repeatCount += 1
        e.repeatCount = this.repeatCount
        this.$emit('click', e)
        setTimer()
      }

      this.repeatCount = 0
      this.repeating = true
      setTimer()
    },
    __abortRepeat () {
      this.repeating = false
      this.__cleanup()
    },
    __endRepeat (e) {
      if (!this.repeating) {
        return
      }

      this.repeating = false
      if (this.repeatCount) {
        this.repeatCount = 0
      }
      else if (e.detail || e.keyCode) {
        e.repeatCount = 0
        this.$emit('click', e)
      }

      this.__cleanup()
    }
  },
  beforeDestroy () {
    this.__cleanup()
  },
  render (h) {
    return h(this.isLink ? 'a' : 'button', {
      staticClass: 'q-btn inline relative-position q-btn-item non-selectable',
      'class': this.classes,
      style: this.style,
      attrs: this.attrs,
      on: this.events,
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      process.env.THEME === 'ios' || this.$q.platform.is.desktop
        ? h('div', { staticClass: 'q-focus-helper' })
        : null,

      this.loading && this.hasPercentage
        ? h('div', {
          staticClass: 'q-btn-progress absolute-full',
          'class': { 'q-btn-dark-progress': this.darkPercentage },
          style: { width: this.width }
        })
        : null,

      h('div', {
        staticClass: 'q-btn-inner row col items-center',
        'class': this.innerClasses
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [
          this.icon
            ? h('QIcon', {
              'class': { 'on-left': this.label && this.isRectangle },
              props: { name: this.icon }
            })
            : null,

          this.label && this.isRectangle ? h('div', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && this.isRectangle
            ? h('QIcon', {
              staticClass: 'on-right',
              props: { name: this.iconRight }
            })
            : null
        ]
      )
    ])
  }
}
