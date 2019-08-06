import Vue from 'vue'

import QField from '../field/QField.js'

import MaskMixin from '../../mixins/mask.js'
import debounce from '../../utils/debounce.js'
import { stop } from '../../utils/event.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField, MaskMixin ],

  props: {
    value: [String, Number],

    type: {
      type: String,
      default: 'text'
    },

    debounce: [String, Number],

    maxlength: [Number, String],
    autogrow: Boolean, // makes a textarea

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

        if (
          this.type === 'number' &&
          this.hasOwnProperty('tempValue') === true
        ) {
          if (this.typedNumber === true) {
            this.typedNumber = false
          }
          else {
            delete this.tempValue
          }
        }
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
      else if (this.$attrs.rows > 0 && this.$refs.input !== void 0) {
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
      return `q-${this.isTextarea === true ? 'textarea' : 'input'}` +
        (this.autogrow === true ? ' q-textarea--autogrow' : '')
    }
  },

  methods: {
    focus () {
      this.$refs.input !== void 0 && this.$refs.input.focus()
    },

    select () {
      this.$refs.input !== void 0 && this.$refs.input.select()
    },

    __onInput (e) {
      if (e && e.target && e.target.composing === true) {
        return
      }

      if (this.type === 'file') {
        this.$emit('input', e.target.files)
        return
      }

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
        if (
          this.type !== 'number' &&
          this.hasOwnProperty('tempValue') === true
        ) {
          delete this.tempValue
        }

        if (this.value !== val) {
          stopWatcher === true && (this.stopValueWatcher = true)
          this.$emit('input', val)
        }
      }

      if (this.type === 'number') {
        this.typedNumber = true
        this.tempValue = val
      }

      if (this.debounce !== void 0) {
        clearTimeout(this.emitTimer)
        this.tempValue = val
        this.emitTimer = setTimeout(fn, this.debounce)
      }
      else {
        fn()
      }
    },

    // textarea only
    __adjustHeight () {
      const inp = this.$refs.input
      if (inp !== void 0) {
        inp.style.height = '1px'
        inp.style.height = inp.scrollHeight + 'px'
      }
    },

    __onCompositionStart (e) {
      e.target.composing = true
    },

    __onCompositionUpdate (e) {
      if (typeof e.data === 'string' && e.data.codePointAt(0) < 256) {
        e.target.composing = false
      }
    },

    __onCompositionEnd (e) {
      if (e.target.composing !== true) { return }
      e.target.composing = false

      this.__onInput(e)
    },

    __onChange (e) {
      this.__onCompositionEnd(e)
      this.$emit('change', e)
    },

    __getControl (h) {
      const on = {
        ...this.$listeners,
        input: this.__onInput,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        change: this.__onChange,
        compositionstart: this.__onCompositionStart,
        compositionend: this.__onCompositionEnd,
        focus: stop,
        blur: stop
      }

      if (this.$q.platform.is.android === true) {
        on.compositionupdate = this.__onCompositionUpdate
      }

      if (this.hasMask === true) {
        on.keydown = this.__onMaskedKeydown
      }

      const attrs = {
        tabindex: 0,
        autofocus: this.autofocus,
        rows: this.type === 'textarea' ? 6 : void 0,
        'aria-label': this.label,
        ...this.$attrs,
        type: this.type,
        maxlength: this.maxlength,
        disabled: this.editable !== true
      }

      if (this.autogrow === true) {
        attrs.rows = 1
      }

      return h(this.isTextarea === true ? 'textarea' : 'input', {
        ref: 'input',
        staticClass: 'q-field__native q-placeholder',
        style: this.inputStyle,
        class: this.inputClass,
        attrs,
        on,
        domProps: this.type !== 'file'
          ? {
            value: this.hasOwnProperty('tempValue') === true
              ? this.tempValue
              : this.innerValue
          }
          : null
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
  },

  beforeDestroy () {
    clearTimeout(this.emitTimer)
  }
})
