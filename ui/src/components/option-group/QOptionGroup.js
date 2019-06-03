import Vue from 'vue'

import WRadio from '../radio/QRadio.js'
import WCheckbox from '../checkbox/QCheckbox.js'
import WToggle from '../toggle/QToggle.js'

const components = {
  radio: WRadio,
  checkbox: WCheckbox,
  toggle: WToggle
}

export default Vue.extend({
  name: 'WOptionGroup',

  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      validator (opts) {
        return opts.every(opt => 'value' in opt && 'label' in opt)
      }
    },

    type: {
      default: 'radio',
      validator: v => ['radio', 'checkbox', 'toggle'].includes(v)
    },

    color: String,
    keepColor: Boolean,
    dark: Boolean,
    dense: Boolean,

    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },

  computed: {
    component () {
      return components[this.type]
    },

    model () {
      return Array.isArray(this.value) ? this.value.slice() : this.value
    }
  },

  methods: {
    __update (value) {
      this.$emit('input', value)
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
    return h('div', {
      staticClass: 'q-option-group q-gutter-x-sm',
      class: this.inline ? 'q-option-group--inline' : null
    }, this.options.map(opt => h('div', [
      h(this.component, {
        props: {
          value: this.value,
          val: opt.value,
          disable: this.disable || opt.disable,
          label: opt.label,
          leftLabel: this.leftLabel || opt.leftLabel,
          color: opt.color || this.color,
          checkedIcon: opt.checkedIcon,
          uncheckedIcon: opt.uncheckedIcon,
          dark: opt.dark || this.dark,
          dense: this.dense,
          keepColor: opt.keepColor || this.keepColor
        },
        on: {
          input: this.__update
        }
      })
    ])))
  }
})
