import Vue from 'vue'

import QField from '../field/QField.js'

import inputTypes from './input-types.js'
import MaskMixin from '../../mixins/mask.js'
import debounce from '../../utils/debounce.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField, MaskMixin ],

  props: {
    value: { required: true },

    type: {
      type: String,
      default: 'text',
      validator: t => inputTypes.includes(t)
    },

    debounce: [String, Number],

    counter: Boolean,
    maxlength: [Number, String],
    autoGrow: Boolean, // makes a textarea
    autoFocus: Boolean,

    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },

  watch: {
    value (v) {
      if (this.hasMask === true) {
        if (this.stopValueWatcher === true) {
          this.stopValueWatcher = false
          return
        }

        this.__updateMaskValue(v)
      }
      else if (this.innerValue !== v) {
        this.innerValue = v
      }

      // textarea only
      this.autoGrow === true && this.$nextTick(this.__adjustHeightDebounce)
    }
  },

  data () {
    return { innerValue: this.__getInitialMaskedValue() }
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
      const val = e.target.value

      if (this.hasMask === true) {
        this.__updateMaskValue(val)
      }
      else {
        this.__emitValue(val)
      }

      // we need to trigger it immediately too,
      // to avoid "flickering"
      this.autoGrow === true && this.__adjustHeight()
    },

    __emitValue (val, stopWatcher) {
      const fn = () => {
        if (this.value !== val) {
          stopWatcher === true && (this.stopValueWatcher = true)
          this.$emit('input', val)
        }
      }

      if (this.debounce !== void 0) {
        clearTimeout(this.emitTimer)
        this.emitTimer = setTimeout(fn, this.debounce)
      }
      else {
        fn()
      }
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
      const on = Object.assign({}, this.$listeners, {
        input: this.__onInput,
        focus: this.__onFocus,
        blur: this.__onBlur
      })

      if (this.hasMask === true) {
        on.keydown = this.__onMaskedKeydown
      }

      return h(this.isTextarea ? 'textarea' : 'input', {
        ref: 'input',
        staticClass: 'q-field__native',
        style: this.inputStyle,
        class: this.inputClass,
        attrs: {
          ...this.$attrs,
          'aria-label': this.label,
          type: this.type,
          maxlength: this.maxlength,
          disabled: this.disable,
          readonly: this.readonly
        },
        on,
        domProps: {
          value: this.innerValue
        }
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
    this.autoFocus === true && this.$nextTick(() => { this.$refs.input.focus() })
  },

  beforeDestroy () {
    clearTimeout(this.emitTimer)
  }
})
