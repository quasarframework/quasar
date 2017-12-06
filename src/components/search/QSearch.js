
import { QInput } from '../input'
import InputMixin from '../../mixins/input'
import FrameMixin from '../../mixins/input-frame'

export default {
  name: 'q-search',
  mixins: [FrameMixin, InputMixin],
  props: {
    value: { required: true },
    type: String,
    debounce: {
      type: Number,
      default: 300
    },
    icon: String,
    placeholder: String
  },
  data () {
    return {
      model: this.value,
      childDebounce: false
    }
  },
  provide () {
    return {
      __inputDebounce: {
        set: val => {
          if (this.model !== val) {
            this.model = val
          }
        },
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
      return this.before || [{
        icon: this.icon || this.$q.icon.search.icon,
        handler: this.focus
      }]
    },
    controlAfter () {
      return this.after || [{
        icon: this.$q.icon.search[`clear${this.inverted ? 'Inverted' : ''}`],
        content: true,
        handler: this.clear
      }]
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
        error: this.error,
        align: this.align,
        floatLabel: this.floatLabel,
        stackLabel: this.stackLabel,
        prefix: this.prefix,
        suffix: this.suffix,
        inverted: this.inverted,
        dark: this.dark,
        maxLength: this.maxLength,
        color: this.color,
        before: this.controlBefore,
        after: this.controlAfter
      },
      on: {
        input: v => { this.model = v },
        focus: this.__onFocus,
        blur: this.__onBlur,
        keyup: this.__onKeyup,
        keydown: this.__onKeydown,
        click: this.__onClick
      }
    }, [
      this.$slots.default
    ])
  }
}
