import { QRadio } from '../radio'
import { QCheckbox } from '../checkbox'
import { QToggle } from '../toggle'
import clone from '../../utils/clone'

export default {
  name: 'q-option-group',
  inject: {
    __field: { default: null }
  },
  components: {
    QRadio,
    QCheckbox,
    QToggle
  },
  props: {
    value: {
      required: true
    },
    type: {
      default: 'radio',
      validator: v => ['radio', 'checkbox', 'toggle'].includes(v)
    },
    color: String,
    keepColor: Boolean,
    dark: Boolean,
    indeterminate: Boolean,
    options: {
      type: Array,
      validator (opts) {
        return opts.every(opt => 'value' in opt && 'label' in opt)
      }
    },
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },
  computed: {
    component () {
      return `q-${this.type}`
    },
    model: {
      get () {
        return clone(this.value)
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    length () {
      return this.value
        ? (this.type === 'radio' ? 1 : this.value.length)
        : 0
    }
  },
  methods: {
    __onChange (val) {
      if (this.type !== 'radio') {
        this.$emit('input', val)
      }
      this.$emit('change', val)
    },
    __onFocus () {
      this.$emit('focus')
    },
    __onBlur () {
      this.$emit('blur')
    }
  },
  created () {
    const isArray = Array.isArray(this.value)
    if (this.type === 'radio') {
      if (isArray) {
        console.error('q-option-group: model should not be array')
      }
    }
    else if (!isArray) {
      console.error('q-option-group: model should be array in your case')
    }
    if (this.__field) {
      this.field = this.__field
      this.field.__registerInput(this, true)
    }
  },
  beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput()
    }
  },
  render (h) {
    return h(
      'div',
      {
        staticClass: 'q-option-group group',
        'class': { 'q-option-group-inline-opts': this.inline }
      },
      this.options.map(
        opt => h('div', [
          h(this.component, {
            props: {
              value: this.model,
              val: opt.value,
              disable: this.disable || opt.disable,
              label: opt.label,
              leftLabel: opt.leftLabel,
              color: opt.color || this.color,
              checkedIcon: opt.checkedIcon,
              uncheckedIcon: opt.uncheckedIcon,
              indeterminateIcon: opt.indeterminateIcon,
              indeterminate: opt.indeterminate,
              dark: opt.dark || this.dark,
              keepColor: opt.keepColor || this.keepColor
            },
            on: {
              input: val => {
                this.model = val
              },
              focus: this.__onFocus,
              blur: this.__onBlur,
              change: this.__onChange
            }
          })
        ])
      )
    )
  }
}
