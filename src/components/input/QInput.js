import Vue from 'vue'

import QField from '../field/QField.js'

import inputTypes from './input-types.js'
import debounce from '../../utils/debounce.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField ],

  props: {
    value: { required: true },

    type: {
      type: String,
      default: 'text',
      validator: t => inputTypes.includes(t)
    },

    counter: Boolean,
    maxlength: [Number, String],
    autoGrow: Boolean, // makes a textarea

    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },

  watch: {
    value () {
      // textarea only
      this.autoGrow === true && this.$nextTick(this.__adjustHeightDebounce)
    }
  },

  computed: {
    isTextarea () {
      return this.type === 'textarea' || this.autoGrow === true
    },

    fieldClass () {
      return `q-${this.isTextarea ? 'textarea' : 'input'}${this.autoGrow ? ' q-textarea--autogrow' : ''}`
    },

    computedCounter () {
      if (this.counter !== false) {
        return this.value.length + (this.maxlength !== void 0 ? ' / ' + this.maxlength : '')
      }
    }
  },

  methods: {
    __onInput (e) {
      this.autoGrow === true && this.__adjustHeight()
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

    // textarea only
    __adjustHeight () {
      const inp = this.$refs.input
      inp.style.height = '1px'
      inp.style.height = inp.scrollHeight + 'px'
    },

    __getControl (h) {
      return h(this.isTextarea ? 'textarea' : 'input', {
        ref: 'input',
        staticClass: 'q-field__native',
        style: this.inputStyle,
        'class': this.inputClass,
        attrs: {
          ...this.$attrs,
          'aria-label': this.label,
          type: this.type,
          maxlength: this.maxlength,
          disabled: this.disable,
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
  },

  created () {
    // textarea only
    this.__adjustHeightDebounce = debounce(this.__adjustHeight, 100)
  },

  mounted () {
    // textarea only
    this.autoGrow === true && this.__adjustHeight()
  }
})
