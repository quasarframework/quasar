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
    const inner = [].concat(this.$slots.default)

    if (this.label !== void 0 && this.isRectangle === true) {
      inner.unshift(
        h('div', [this.label])
      )
    }

    if (this.icon !== void 0) {
      inner.unshift(
        h(QIcon, {
          class: { 'on-left': this.label !== void 0 && this.isRectangle === true },
          props: { name: this.icon }
        })
      )
    }

    if (this.iconRight !== void 0 && this.isRound === false) {
      inner.push(
        h(QIcon, {
          staticClass: 'on-right',
          props: { name: this.iconRight }
        })
      )
    }

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
        staticClass: 'q-btn-inner row col items-center q-popup--skip',
        'class': this.innerClasses
      }, inner),

      this.loading !== null
        ? h('transition', {
          props: { name: 'q-transition--fade' }
        }, this.loading === true ? [
          h('div', {
            key: 'loading',
            staticClass: 'absolute-full flex flex-center'
          }, this.$slots.loading !== void 0 ? this.$slots.loading : [h(QSpinner)])
        ] : void 0)
        : null
    ])
  }
}
