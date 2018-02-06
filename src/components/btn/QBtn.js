import BtnMixin from './btn-mixin'
import { QSpinner } from '../spinner'
import { between } from '../../utils/format'

export default {
  name: 'q-btn',
  mixins: [BtnMixin],
  props: {
    value: Boolean,
    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean,
    waitForRipple: Boolean,
    repeatTimeout: [Number, Function]
  },
  data () {
    return {
      loading: this.value || false,
      repeated: 0
    }
  },
  watch: {
    value (val) {
      if (this.loading !== val) {
        this.loading = val
      }
    }
  },
  computed: {
    hasPercentage () {
      return this.percentage !== void 0
    },
    width () {
      return `${between(this.percentage, 0, 100)}%`
    },
    hasNoRepeat () {
      return this.isDisabled || !this.repeatTimeout || this.loader !== false
    }
  },
  methods: {
    click (e) {
      clearTimeout(this.timer)

      const trigger = () => {
        if (this.isDisabled || this.repeated) {
          this.__clearRepeat(0)
          return
        }

        this.removeFocus(e)
        if (this.loader !== false || this.$slots.loading) {
          this.loading = true
          this.$emit('input', true)
        }
        this.$emit('click', e, () => {
          this.loading = false
          this.$emit('input', false)
        })
      }

      if (this.waitForRipple && this.hasRipple) {
        this.timer = setTimeout(trigger, 350)
      }
      else {
        trigger()
      }
    },
    __clearRepeat (delay = 500) {
      clearTimeout(this.clearTimer)
      clearTimeout(this.timer)
      this.clearTimer = setTimeout(() => { this.repeated = 0 }, delay)
    },
    __startRepeat (e) {
      if (this.repeated) {
        return
      }
      this.__clearRepeat(0)

      const setTimer = () => {
        this.timer = setTimeout(
          trigger,
          typeof this.repeatTimeout === 'function'
            ? this.repeatTimeout(this.repeated)
            : this.repeatTimeout
        )
      }
      const trigger = () => {
        if (this.hasNoRepeat || this.$slots.loading) {
          this.__clearRepeat()
          return
        }
        this.repeated += 1
        e.repeatCount = this.repeated
        this.$emit('click', e)
        setTimer()
      }

      setTimer()
    },
    __endRepeat () {
      this.__clearRepeat()
    }
  },
  beforeDestroy () {
    clearTimeout(this.clearTimer)
    clearTimeout(this.timer)
  },
  render (h) {
    const on = this.hasNoRepeat || this.$slots.loading
      ? {}
      : {
        mousedown: this.__startRepeat,
        touchstart: this.__startRepeat,
        mouseup: this.__endRepeat,
        mouseleave: this.__endRepeat,
        touchend: this.__endRepeat,
        touchcancel: this.__endRepeat
      }

    on.click = this.click

    return h('button', {
      staticClass: 'q-btn inline relative-position',
      'class': this.classes,
      style: this.style,
      attrs: { tabindex: this.isDisabled ? -1 : this.tabindex || 0 },
      on,
      directives: this.hasRipple
        ? [{
          name: 'ripple',
          value: true
        }]
        : null
    }, [
      h('div', { staticClass: 'q-focus-helper' }),

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
            ? h('q-icon', {
              'class': { 'on-left': this.label && this.isRectangle },
              props: { name: this.icon }
            })
            : null,

          this.label && this.isRectangle ? h('div', [ this.label ]) : null,

          this.$slots.default,

          this.iconRight && this.isRectangle
            ? h('q-icon', {
              staticClass: 'on-right',
              props: { name: this.iconRight }
            })
            : null
        ]
      )
    ])
  }
}
