import BtnMixin from './btn-mixin.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import { between } from '../../utils/format.js'
import { stopAndPrevent } from '../../utils/event.js'

export default {
  name: 'QBtn',
  mixins: [BtnMixin],
  props: {
    percentage: Number,
    darkPercentage: Boolean,
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
    },
    hasLabel () {
      return this.label && this.isRectangle
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

      if (this.to !== void 0 || this.isDisabled) {
        e && stopAndPrevent(e)
        if (this.isDisabled) { return }
      }

      if (e && e.detail !== -1 && this.type === 'submit') {
        stopAndPrevent(e)
        const ev = new MouseEvent('click', Object.assign({}, e, {detail: -1}))
        this.timer = setTimeout(() => this.$el && this.$el.dispatchEvent(ev), 200)
        return
      }

      const go = () => {
        this.$router[this.replace ? 'replace' : 'push'](this.to)
      }

      const trigger = () => {
        if (!this.isDisabled) {
          this.$emit('click', e, go)
          this.to !== void 0 && e.navigate !== false && go()
        }
      }

      trigger()
    },
    __cleanup () {
      clearTimeout(this.timer)
    },
    __onKeyDown (e, repeat) {
      if (this.isDisabled || e.keyCode !== 13) {
        return
      }
      this.active = true
      repeat ? this.__startRepeat(e) : stopAndPrevent(e)
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
          value: true,
          modifiers: { center: this.isRound }
        }]
        : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

      this.loading && this.hasPercentage
        ? h('div', {
          staticClass: 'q-btn__progress absolute-full',
          'class': { 'q-btn__progress--dark': this.darkPercentage },
          style: { width: this.width }
        })
        : null,

      h('div', {
        staticClass: 'q-btn__content row col items-center',
        'class': this.innerClasses
      },
      this.loading
        ? [ this.$slots.loading || h(QSpinner) ]
        : [
          this.icon
            ? h(QIcon, {
              props: { name: this.icon, left: this.hasLabel }
            })
            : null,

          this.hasLabel ? h('div', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && this.isRectangle
            ? h(QIcon, {
              props: { name: this.iconRight, right: true }
            })
            : null
        ]
      )
    ])
  }
}
