import FrameMixin from '../../mixins/input-frame.js'
import InputMixin from '../../mixins/input.js'
import QInputFrame from '../input-frame/QInputFrame.js'
import QChip from '../chip/QChip.js'
import QIcon from '../icon/QIcon.js'
import QSpinner from '../spinner/QSpinner.js'
import { getEventKey, stopAndPrevent } from '../../utils/event.js'

export default {
  name: 'QChipsInput',
  mixins: [FrameMixin, InputMixin],
  props: {
    value: {
      type: Array,
      required: true
    },
    chipsColor: String,
    chipsBgColor: String,
    readonly: Boolean,
    addIcon: String,
    upperCase: Boolean,
    lowerCase: Boolean
  },
  data () {
    return {
      input: '',
      model: this.value.slice(),
      watcher: null,
      shadow: {
        val: this.input,
        set: this.add,
        setNav: val => {
          this.input = val
        },
        loading: false,
        selectionOpen: false,
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
      this.model = v.slice()
    }
  },
  provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    length () {
      return this.model
        ? this.model.length
        : 0
    },
    isLoading () {
      return this.loading || (this.shadow.watched && this.shadow.loading)
    },
    computedAddIcon () {
      return this.addIcon || this.$q.icon.chipsInput.add
    },
    computedChipTextColor () {
      if (this.chipsColor) {
        return this.chipsColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? this.color : 'white'
      }
      if (this.isInverted) {
        return this.invertedLight ? 'grey-10' : this.color
      }
      return this.dark
        ? this.color
        : 'white'
    },
    computedChipBgColor () {
      if (this.chipsBgColor) {
        return this.chipsBgColor
      }
      if (this.isInvertedLight) {
        return this.invertedLight ? 'grey-10' : this.color
      }
      if (this.isInverted) {
        return this.invertedLight ? this.color : 'white'
      }
      return this.dark
        ? 'white'
        : this.color
    },
    inputClasses () {
      const cls = [ this.alignClass ]

      this.upperCase && cls.push('uppercase')
      this.lowerCase && cls.push('lowercase')

      return cls
    },
    isClearable () {
      return this.editable && this.clearable && this.model.length !== 0
    }
  },
  methods: {
    add (value = this.input) {
      clearTimeout(this.timer)
      this.focus()

      if (this.isLoading || !this.editable || !value) {
        return
      }

      const val = this.lowerCase
        ? value.toLowerCase()
        : (
          this.upperCase
            ? value.toUpperCase()
            : value
        )

      if (this.model.includes(val)) {
        this.$emit('duplicate', val)
        return
      }

      this.$emit('add', { index: this.model.length, val })
      this.model.push(val)
      this.$emit('input', this.model)
      this.input = ''
    },
    remove (index) {
      clearTimeout(this.timer)
      this.focus()
      if (this.editable && index >= 0 && index < this.length) {
        this.$emit('remove', { index, value: this.model.splice(index, 1) })
        this.$emit('input', this.model)
      }
    },
    clear (evt) {
      clearTimeout(this.timer)
      evt && stopAndPrevent(evt)
      if (this.editable) {
        this.$emit('input', [])
        this.$emit('clear')
      }
    },
    __clearTimer () {
      this.$nextTick(() => clearTimeout(this.timer))
    },
    __handleKeyDown (e) {
      switch (getEventKey(e)) {
        case 13: // ENTER key
          if (this.shadow.selectionOpen) {
            return
          }
          stopAndPrevent(e)
          return this.add()
        case 8: // Backspace key
          if (!this.input.length && this.length) {
            this.remove(this.length - 1)
          }
          return
        default:
          return this.__onKeydown(e)
      }
    },
    __onClick () {
      this.focus()
    },
    __watcher (value) {
      if (this.shadow.watched) {
        this.shadow.val = value
      }
    },
    __watcherRegister () {
      if (!this.watcher) {
        this.watcher = this.$watch('input', this.__watcher)
      }
    },
    __watcherUnregister (forceUnregister) {
      if (
        this.watcher &&
        (forceUnregister || !this.shadow.watched)
      ) {
        this.watcher()
        this.watcher = null
        this.shadow.selectionOpen = false
      }
    }
  },
  beforeDestroy () {
    this.__watcherUnregister(true)
  },

  render (h) {
    return h(QInputFrame, {
      staticClass: 'q-chips-input',
      props: {
        prefix: this.prefix,
        suffix: this.suffix,
        stackLabel: this.stackLabel,
        floatLabel: this.floatLabel,
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
        length: this.length,
        additionalLength: this.input.length > 0
      },
      on: { click: this.__onClick }
    }, [
      h('div', {
        staticClass: 'col row items-center q-input-chips'
      },
      this.model.map((label, index) => {
        return h(QChip, {
          key: `${label}#${index}`,
          props: {
            small: true,
            closable: this.editable,
            color: this.computedChipBgColor,
            textColor: this.computedChipTextColor
          },
          attrs: {
            tabindex: this.editable && this.focused ? 0 : -1
          },
          on: {
            blur: this.__onInputBlur,
            focus: this.__clearTimer,
            hide: () => { this.remove(index) }
          },
          nativeOn: {
            blur: this.__onInputBlur,
            focus: this.__clearTimer
          }
        }, label)
      }).concat([
        h('input', {
          ref: 'input',
          staticClass: 'col q-input-target',
          'class': this.inputClasses,
          domProps: {
            value: this.input
          },
          attrs: Object.assign({}, this.$attrs, {
            placeholder: this.inputPlaceholder,
            disabled: this.disable,
            readonly: this.readonly
          }),
          on: {
            input: e => { this.input = e.target.value },
            focus: this.__onFocus,
            blur: this.__onInputBlur,
            keydown: this.__handleKeyDown,
            keyup: this.__onKeyup
          }
        })
      ])),

      this.isLoading
        ? (
          this.$slots.loading
            ? h('div', {
              staticClass: 'q-if-control',
              slot: 'after'
            }, this.$slots.loading)
            : h(QSpinner, {
              slot: 'after',
              staticClass: 'q-if-control',
              props: { size: '24px' }
            })
        )
        : ((this.editable && h(QIcon, {
          slot: 'after',
          staticClass: 'q-if-control',
          'class': { invisible: this.input.length === 0 },
          props: { name: this.computedAddIcon },
          nativeOn: {
            mousedown: this.__clearTimer,
            touchstart: this.__clearTimer,
            click: () => { this.add() }
          }
        })) || void 0),

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
      })) || void 0
    ].concat(this.$slots.default
      ? h('div', { staticClass: 'absolute-full no-pointer-events', slot: 'after' }, this.$slots.default)
      : void 0
    ))
  }
}
