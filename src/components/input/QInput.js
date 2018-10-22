import Vue from 'vue'

import QField from '../field/QField.js'

import inputTypes from './input-types.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField ],

  fieldOptions: {
    classes: 'q-input'
  },

  props: {
    value: { required: true },

    type: {
      type: String,
      default: 'text',
      validator: t => inputTypes.includes(t)
    },

    counter: {
      type: [Boolean, String, Number],
      default: void 0
    }
  },

  computed: {
    computedCounter () {
      if (this.counter !== false) {
        return this.value.length + (this.counter !== true ? '/' + this.counter : '')
      }
    }
  },

  methods: {
    __onInput (e) {
      this.$emit('input', e.target.value)
    },

    __onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },

    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
    },

    __getControl (h) {
      return h('input', {
        staticClass: 'q-field__native',
        attrs: {
          ...this.$attrs,
          type: this.type,
          disable: this.disable,
          readonly: this.readonly
        },
        domProps: {
          value: this.value
        },
        on: Object.assign({}, this.$listeners, {
          input: this.__onInput,
          focus: this.__onFocus,
          blur: this.__onBlur
        })
      })
    }
  }
})
