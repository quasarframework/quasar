import QInput from '../input/QInput.js'
import InputMixin from '../../mixins/input.js'
import FrameMixin from '../../mixins/input-frame.js'

export default {
  name: 'QSearch',
  mixins: [FrameMixin, InputMixin],
  props: {
    value: { required: true },
    type: String,
    debounce: {
      type: Number,
      default: 300
    },
    icon: String,
    noIcon: Boolean,
    upperCase: Boolean,
    lowerCase: Boolean
  },
  data () {
    return {
      model: this.value,
      childDebounce: false
    }
  },
  provide () {
    const set = val => {
      if (this.model !== val) {
        this.model = val
      }
    }
    return {
      __inputDebounce: {
        set,
        setNav: set,
        setChildDebounce: v => {
          this.childDebounce = v
        }
      }
    }
  },
  watch: {
    value (v) {
      this.model = v
    },
    model (val) {
      clearTimeout(this.timer)
      if (this.value === val) {
        return
      }
      if (!val && val !== 0) {
        this.model = this.type === 'number' ? null : ''
      }
      this.timer = setTimeout(() => {
        this.$emit('input', this.model)
      }, this.debounceValue)
    }
  },
  computed: {
    debounceValue () {
      return this.childDebounce
        ? 0
        : this.debounce
    },
    computedClearValue () {
      return this.isNumber && this.clearValue === 0
        ? this.clearValue
        : this.clearValue || (this.type === 'number' ? null : '')
    },
    controlBefore () {
      const before = (this.before || []).slice()
      if (!this.noIcon) {
        before.unshift({
          icon: this.icon || this.$q.icon.search.icon,
          handler: this.focus
        })
      }
      return before
    },
    controlAfter () {
      const after = (this.after || []).slice()
      if (this.isClearable) {
        after.push({
          icon: this.$q.icon.search[`clear${this.isInverted ? 'Inverted' : ''}`],
          handler: this.clear
        })
      }
      return after
    }
  },
  methods: {
    clear (evt) {
      this.$refs.input.clear(evt)
    }
  },
  render (h) {
    return h(QInput, {
      ref: 'input',
      staticClass: 'q-search',
      props: {
        value: this.model,
        type: this.type,
        autofocus: this.autofocus,
        placeholder: this.placeholder || this.$q.i18n.label.search,
        disable: this.disable,
        readonly: this.readonly,
        error: this.error,
        warning: this.warning,
        align: this.align,
        noParentField: this.noParentField,
        floatLabel: this.floatLabel,
        stackLabel: this.stackLabel,
        prefix: this.prefix,
        suffix: this.suffix,
        inverted: this.inverted,
        invertedLight: this.invertedLight,
        dark: this.dark,
        dense: this.dense,
        box: this.box,
        fullWidth: this.fullWidth,
        outline: this.outline,
        hideUnderline: this.hideUnderline,
        color: this.color,
        rows: this.rows,
        before: this.controlBefore,
        after: this.controlAfter,
        clearValue: this.clearValue,
        upperCase: this.upperCase,
        lowerCase: this.lowerCase
      },
      attrs: this.$attrs,
      on: {
        input: v => { this.model = v },
        focus: this.__onFocus,
        blur: this.__onBlur,
        keyup: this.__onKeyup,
        keydown: this.__onKeydown,
        click: this.__onClick,
        clear: val => {
          this.$emit('clear', val)
          this.__emit()
        }
      }
    }, this.$slots.default)
  }
}
