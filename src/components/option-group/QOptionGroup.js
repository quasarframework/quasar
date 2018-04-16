import { QRadio } from '../radio'
import { QCheckbox } from '../checkbox'
import { QToggle } from '../toggle'
import ParentFieldMixin from '../../mixins/parent-field'

export default {
  name: 'QOptionGroup',
  mixins: [ParentFieldMixin],
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
    options: {
      type: Array,
      validator (opts) {
        return opts.every(opt => 'value' in opt && 'label' in opt)
      }
    },
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    component () {
      return `q-${this.type}`
    },
    model () {
      return Array.isArray(this.value) ? this.value.slice() : this.value
    },
    length () {
      return this.value
        ? (this.type === 'radio' ? 1 : this.value.length)
        : 0
    },
    __needsBorder () {
      return true
    }
  },
  methods: {
    __onFocus () {
      this.$emit('focus')
    },
    __onBlur () {
      this.$emit('blur')
    },
    __update (value) {
      this.$emit('input', value)
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
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
              value: this.value,
              val: opt.value,
              readonly: this.readonly || opt.readonly,
              disable: this.disable || opt.disable,
              label: opt.label,
              leftLabel: this.leftLabel || opt.leftLabel,
              color: opt.color || this.color,
              checkedIcon: opt.checkedIcon,
              uncheckedIcon: opt.uncheckedIcon,
              dark: opt.dark || this.dark,
              keepColor: opt.keepColor || this.keepColor
            },
            on: {
              input: this.__update,
              focus: this.__onFocus,
              blur: this.__onBlur
            }
          })
        ])
      )
    )
  }
}
