import Vue from 'vue'

import QField from '../field/QField.js'

import MaskMixin from '../../mixins/mask.js'
import debounce from '../../utils/debounce.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField, MaskMixin ],

  props: {
    value: { required: true },

    type: {
      type: String,
      default: 'text'
    },

    debounce: [String, Number],

    counter: Boolean,
    maxlength: [Number, String],
    autogrow: Boolean, // makes a textarea
    autofocus: Boolean,

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
      this.autogrow === true && this.$nextTick(this.__adjustHeightDebounce)
    },

    autogrow (autogrow) {
      // textarea only
      if (autogrow === true) {
        this.$nextTick(this.__adjustHeightDebounce)
      }
      // if it has a number of rows set respect it
      else if (this.$attrs.rows > 0) {
        const inp = this.$refs.input
        inp.style.height = 'auto'
      }
    }
  },

  data () {
    return { innerValue: this.__getInitialMaskedValue() }
  },

  computed: {
    isTextarea () {
      return this.type === 'textarea' || this.autogrow === true
    },

    fieldClass () {
      return `q-${this.isTextarea ? 'textarea' : 'input'}${this.autogrow ? ' q-textarea--autogrow' : ''}`
    },

    computedCounter () {
      if (this.counter !== false) {
        const len = typeof this.value === 'string' || typeof this.value === 'number'
          ? ('' + this.value).length
          : 0
        return len + (this.maxlength !== void 0 ? ' / ' + this.maxlength : '')
      }
    }
  },

  methods: {
    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },

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
      this.autogrow === true && this.__adjustHeight()
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
      if (this.editable === true && this.focused === false) {
        this.focused = true
        this.$emit('focus', e)
      }
    },

    __onBlur (e) {
      if (this.focused === true) {
        this.focused = false
        this.$emit('blur', e)
      }
    },

    // textarea only
    __adjustHeight () {
      const inp = this.$refs.input
      inp.style.height = '1px'
      inp.style.height = inp.scrollHeight + 'px'
    },

    __getControl (h) {
      const on = {
        ...this.$listeners,
        input: this.__onInput,
        focus: this.__onFocus,
        blur: this.__onBlur
      }

      if (this.hasMask === true) {
        on.keydown = this.__onMaskedKeydown
      }

      const attrs = {
        rows: this.type === 'textarea' ? 6 : void 0,
        ...this.$attrs,
        'aria-label': this.label,
        type: this.type,
        maxlength: this.maxlength,
        disabled: this.disable,
        readonly: this.readonly
      }

      if (this.autogrow === true) {
        attrs.rows = 1
      }

      return h(this.isTextarea ? 'textarea' : 'input', {
        ref: 'input',
        staticClass: 'q-field__native',
        style: this.inputStyle,
        class: this.inputClass,
        attrs,
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
    this.autogrow === true && this.__adjustHeight()
    this.autofocus === true && this.$nextTick(this.focus)
  },

  beforeDestroy () {
    clearTimeout(this.emitTimer)
  }
})
