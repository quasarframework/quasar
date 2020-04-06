import Vue from 'vue'

import QRadio from '../radio/QRadio.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QToggle from '../toggle/QToggle.js'

import DarkMixin from '../../mixins/dark.js'

import { cache } from '../../utils/vm.js'

const components = {
  radio: QRadio,
  checkbox: QCheckbox,
  toggle: QToggle
}

const typeValues = Object.keys(components)

export default Vue.extend({
  name: 'QOptionGroup',

  mixins: [ DarkMixin ],

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

    name: String,

    type: {
      default: 'radio',
      validator: v => typeValues.includes(v)
    },

    color: String,
    keepColor: Boolean,
    dense: Boolean,

    size: String,

    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },

  computed: {
    component () {
      return components[this.type]
    },

    model () {
      return Array.isArray(this.value)
        ? this.value.slice()
        : this.value
    },

    classes () {
      return 'q-option-group q-gutter-x-sm' +
        (this.inline === true ? ' q-option-group--inline' : '')
    },

    attrs () {
      if (this.type === 'radio') {
        const attrs = {
          role: 'radiogroup'
        }

        if (this.disable === true) {
          attrs['aria-disabled'] = ''
        }

        return attrs
      }
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
    else if (isArray === false) {
      console.error('q-option-group: model should be array in your case')
    }
  },

  render (h) {
    return h('div', {
      class: this.classes,
      attrs: this.attrs,
      on: this.$listeners
    }, this.options.map(opt => h('div', [
      h(this.component, {
        props: {
          value: this.value,
          val: opt.value,
          name: this.name || opt.name,
          disable: this.disable || opt.disable,
          label: opt.label,
          leftLabel: this.leftLabel || opt.leftLabel,
          color: opt.color || this.color,
          checkedIcon: opt.checkedIcon,
          uncheckedIcon: opt.uncheckedIcon,
          dark: opt.dark || this.isDark,
          size: opt.size || this.size,
          dense: this.dense,
          keepColor: opt.keepColor || this.keepColor
        },
        on: cache(this, 'inp', {
          input: this.__update
        })
      })
    ])))
  }
})
