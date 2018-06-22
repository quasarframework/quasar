import { QInput } from '../input'
import InputMixin from '../../mixins/input'
import FrameMixin from '../../mixins/input-frame'

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
    placeholder: String,
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
    controlBefore () {
      return this.before || (
        this.noIcon
          ? null
          : [{
            icon: this.icon || this.$q.icon.search.icon,
            handler: this.focus
          }]
      )
    },
    controlAfter () {
      if (this.after) {
        return this.after
      }
      if (this.editable && this.clearable) {
        return [{
          icon: this.$q.icon.search[`clear${this.isInverted ? 'Inverted' : ''}`],
          content: true,
          handler: this.clear
        }]
      }
    }
  },
  methods: {
    clear () {
      this.$refs.input.clear()
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
        hideUnderline: this.hideUnderline,
        color: this.color,
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
