import FrameMixin from '../../mixins/input-frame.js'
import InputMixin from '../../mixins/input.js'
import inputTypes from './input-types.js'
import frameDebounce from '../../utils/frame-debounce.js'
import { between } from '../../utils/format.js'
import QResizeObservable from '../observables/QResizeObservable.js'
import QInputFrame from '../input-frame/QInputFrame.js'
import QSpinner from '../spinner/QSpinner.js'
import QIcon from '../icon/QIcon.js'

export default {
  name: 'QInput',
  mixins: [FrameMixin, InputMixin],
  props: {
    value: { required: true },
    type: {
      type: String,
      default: 'text',
      validator: t => inputTypes.includes(t)
    },
    align: {
      type: String,
      validator: v => ['left', 'center', 'right'].includes(v)
    },
    noPassToggle: Boolean,
    numericKeyboardToggle: Boolean,
    readonly: Boolean,

    decimals: Number,
    step: Number,
    upperCase: Boolean,
    lowerCase: Boolean,
    initialShowPassword: Boolean
  },
  data () {
    return {
      showPass: this.initialShowPassword,
      showNumber: true,
      model: this.value,
      watcher: null,
      autofilled: false,
      shadow: {
        val: this.model,
        set: this.__set,
        setNav: this.__set,
        loading: false,
        watched: 0,
        isEditable: () => this.editable,
        isDark: () => this.dark,
        hasFocus: () => document.activeElement === this.$refs.input,
        register: () => {
          this.shadow.watched += 1
          this.__watcherRegister()
        },
        unregister: () => {
          this.shadow.watched = Math.max(0, this.shadow.watched - 1)
          this.__watcherUnregister()
        },
        getEl: () => this.$refs.input
      }
    }
  },
  watch: {
    value (v) {
      const
        vOldNum = parseFloat(this.model),
        vNewNum = parseFloat(v)
      if (!this.isNumber || this.isNumberError || isNaN(vOldNum) || isNaN(vNewNum) || vOldNum !== vNewNum) {
        this.model = v
      }
      this.isNumberError = false
      this.isNegZero = false
    },
    isTextarea (v) {
      this[v ? '__watcherRegister' : '__watcherUnregister']()
    },
    '$attrs.rows' () {
      this.isTextarea && this.__updateArea()
    }
  },
  provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    isNumber () {
      return this.type === 'number'
    },
    isPassword () {
      return this.type === 'password'
    },
    isTextarea () {
      return this.type === 'textarea'
    },
    isLoading () {
      return this.loading || (this.shadow.watched && this.shadow.loading)
    },
    keyboardToggle () {
      return this.$q.platform.is.mobile &&
        this.isNumber &&
        this.numericKeyboardToggle
    },
    inputType () {
      if (this.isPassword) {
        return this.showPass && this.editable ? 'text' : 'password'
      }
      return this.isNumber
        ? (this.showNumber || !this.editable ? 'number' : 'text')
        : this.type
    },
    inputClasses () {
      const classes = []
      this.align && classes.push(`text-${this.align}`)
      this.autofilled && classes.push('q-input-autofill')
      return classes
    },
    length () {
      return this.model !== null && this.model !== undefined
        ? ('' + this.model).length
        : 0
    },
    computedClearValue () {
      return this.clearValue === void 0 ? (this.isNumber ? null : '') : this.clearValue
    },
    computedStep () {
      return this.step || (this.decimals ? 10 ** -this.decimals : 'any')
    },

    frameProps () {
      return {
        prefix: this.prefix,
        suffix: this.suffix,
        stackLabel: this.stackLabel,
        floatLabel: this.floatLabel,
        placeholder: this.placeholder,
        error: this.error,
        warning: this.warning,
        disable: this.disable,
        readonly: this.readonly,
        inverted: this.inverted,
        invertedLight: this.invertedLight,
        dark: this.dark,
        hideUnderline: this.hideUnderline,
        before: this.before,
        after: this.after,
        color: this.color,
        noParentField: this.noParentField,
        focused: this.focused,
        length: this.autofilled + this.length
      }
    }
  },
  methods: {
    togglePass () {
      this.showPass = !this.showPass
      clearTimeout(this.timer)
      this.focus()
    },
    toggleNumber () {
      this.showNumber = !this.showNumber
      clearTimeout(this.timer)
      this.focus()
    },

    __clearTimer () {
      this.$nextTick(() => clearTimeout(this.timer))
    },

    __onAnimationStart (e) {
      if (e.animationName.indexOf('webkit-autofill-') === 0) {
        const value = e.animationName === 'webkit-autofill-on'
        if (value !== this.autofilled) {
          e.value = this.autofilled = value
          e.el = this
          return this.$emit('autofill', e)
        }
      }
    },

    __setModel (val) {
      clearTimeout(this.timer)
      this.focus()
      this.__set(
        this.isNumber && val === 0
          ? val
          : val || (this.isNumber ? null : ''),
        true
      )
    },
    __set (e, forceUpdate) {
      let val = e && e.target ? e.target.value : e

      if (this.isNumber) {
        this.isNegZero = (1 / val) === -Infinity
        const forcedValue = this.isNegZero ? -0 : val

        this.model = val

        val = parseFloat(val)
        if (isNaN(val) || this.isNegZero) {
          this.isNumberError = true
          if (forceUpdate) {
            this.$emit('input', forcedValue)
            this.$nextTick(() => {
              if (String(1 / forcedValue) !== String(1 / this.value)) {
                this.$emit('change', forcedValue)
              }
            })
          }
          return
        }
        this.isNumberError = false
        if (Number.isInteger(this.decimals)) {
          val = parseFloat(val.toFixed(this.decimals))
        }
      }
      else {
        if (this.lowerCase) {
          val = val.toLowerCase()
        }
        else if (this.upperCase) {
          val = val.toUpperCase()
        }

        this.model = val
      }

      this.$emit('input', val)
      if (forceUpdate) {
        this.$nextTick(() => {
          if (JSON.stringify(val) !== JSON.stringify(this.value)) {
            this.$emit('change', val)
          }
        })
      }
    },
    __updateArea () {
      const
        shadow = this.$refs.shadow,
        input = this.$refs.input
      if (shadow && input) {
        const
          sH = shadow.scrollHeight,
          h = between(sH, shadow.offsetHeight, this.maxHeight || sH)
        input.style.height = `${h}px`
        input.style.overflowY = this.maxHeight && h < sH ? 'scroll' : 'hidden'
      }
    },
    __watcher (value) {
      if (this.isTextarea) {
        this.__updateArea()
      }
      if (this.shadow.watched) {
        this.shadow.val = value
      }
    },
    __watcherRegister () {
      if (!this.watcher) {
        this.watcher = this.$watch('model', this.__watcher)
      }
    },
    __watcherUnregister (forceUnregister) {
      if (
        this.watcher &&
        (forceUnregister || (!this.isTextarea && !this.shadow.watched))
      ) {
        this.watcher()
        this.watcher = null
      }
    },

    __getTextarea (h) {
      const attrs = Object.assign({ rows: 1 }, this.$attrs)

      return h('div', {
        staticClass: 'col row relative-position'
      }, [
        h(QResizeObservable, {
          on: { resize: this.__updateArea }
        }),

        h('textarea', {
          ref: 'shadow',
          staticClass: 'col q-input-target q-input-shadow absolute-top',
          domProps: { value: this.model },
          attrs
        }),

        h('textarea', {
          ref: 'input',
          staticClass: 'col q-input-target q-input-area',
          attrs: Object.assign({}, attrs, {
            placeholder: this.inputPlaceholder,
            disabled: this.disable,
            readonly: this.readonly
          }),
          domProps: { value: this.model },
          on: {
            input: this.__set,
            focus: this.__onFocus,
            blur: this.__onInputBlur,
            keydown: this.__onKeydown,
            keyup: this.__onKeyup,
            paste: this.__onPaste
          }
        })
      ])
    },

    __getInput (h) {
      return h('input', {
        ref: 'input',
        staticClass: 'col q-input-target q-no-input-spinner ellipsis',
        'class': this.inputClasses,
        attrs: Object.assign({}, this.$attrs, {
          type: this.inputType,
          placeholder: this.inputPlaceholder,
          disabled: this.disable,
          readonly: this.readonly,
          step: this.computedStep
        }),
        domProps: { value: this.model },
        on: {
          input: this.__set,
          focus: this.__onFocus,
          blur: this.__onInputBlur,
          keydown: this.__onKeydown,
          keyup: this.__onKeyup,
          paste: this.__onPaste,
          animationstart: this.__onAnimationStart
        }
      })
    }
  },
  mounted () {
    this.__updateArea = frameDebounce(this.__updateArea)
    if (this.isTextarea) {
      this.__updateArea()
      this.__watcherRegister()
    }
  },
  beforeDestroy () {
    this.__watcherUnregister(true)
  },

  render (h) {
    return h(QInputFrame, {
      staticClass: 'q-input',
      props: this.frameProps,
      on: {
        click: this.__onClick,
        focus: this.__onFocus,
        paste: this.__onPaste
      }
    },
    [].concat(this.$slots.before).concat([
      this.isTextarea ? this.__getTextarea(h) : this.__getInput(h),

      (!this.disable && this.isPassword && !this.noPassToggle && (this.initialShowPassword || this.length) && h(QIcon, {
        slot: 'after',
        staticClass: 'q-if-control',
        props: {
          name: this.$q.icon.input[this.showPass ? 'showPass' : 'hidePass']
        },
        nativeOn: {
          mousedown: this.__clearTimer,
          touchstart: this.__clearTimer,
          click: this.togglePass
        }
      })) || void 0,

      (this.editable && this.keyboardToggle && h(QIcon, {
        slot: 'after',
        staticClass: 'q-if-control',
        props: {
          name: this.$q.icon.input[this.showNumber ? 'showNumber' : 'hideNumber']
        },
        nativeOn: {
          mousedown: this.__clearTimer,
          touchstart: this.__clearTimer,
          click: this.toggleNumber
        }
      })) || void 0,

      (this.isClearable && h(QIcon, {
        slot: 'after',
        staticClass: 'q-if-control',
        props: {
          name: this.$q.icon.input[`clear${this.isInverted ? 'Inverted' : ''}`]
        },
        nativeOn: {
          mousedown: this.__clearTimer,
          touchstart: this.__clearTimer,
          click: this.clear
        }
      })) || void 0,

      (this.isLoading && (this.$slots.loading
        ? h('div', {
          staticClass: 'q-if-control',
          slot: 'after'
        }, this.$slots.loading)
        : h(QSpinner, {
          slot: 'after',
          staticClass: 'q-if-control',
          props: { size: '24px' }
        }))) || void 0
    ]).concat(this.$slots.after).concat(this.$slots.default
      ? h('div', { staticClass: 'absolute-full no-pointer-events', slot: 'after' }, this.$slots.default)
      : void 0
    ))
  }
}
