import Vue from 'vue'

import QField from '../field/QField.js'

import MaskMixin from '../../mixins/mask.js'
import CompositionMixin from '../../mixins/composition.js'
import debounce from '../../utils/debounce.js'
import { stop } from '../../utils/event.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField, MaskMixin, CompositionMixin ],

  props: {
    value: { required: false },

    type: {
      type: String,
      default: 'text'
    },

    debounce: [String, Number],

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
    },

    dense () {
      this.autogrow === true && this.$nextTick(this.__adjustHeight)
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
      const el = document.activeElement
      if (
        this.$refs.input !== void 0 &&
        this.$refs.input !== el &&
        // IE can have null document.activeElement
        (el === null || el.id !== this.targetUid)
      ) {
        this.$refs.input.focus()
      }
    },

    select () {
      this.$refs.input !== void 0 && this.$refs.input.select()
    },

    __onPaste (e) {
      if (this.hasMask === true && this.reverseFillMask !== true) {
        const inp = e.target
        this.__moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd)
      }
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
        this.__updateMaskValue(val, false, e.inputType)
      }
      else {
        this.__emitValue(val)
      }

      // we need to trigger it immediately too,
      // to avoid "flickering"
      this.autogrow === true && this.__adjustHeight()
    },

    __emitValue (val, stopWatcher) {
      this.emitValueFn = () => {
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

        this.emitValueFn = void 0
      }

      if (this.type === 'number') {
        this.typedNumber = true
        this.tempValue = val
      }

      if (this.debounce !== void 0) {
        clearTimeout(this.emitTimer)
        this.tempValue = val
        this.emitTimer = setTimeout(this.emitValueFn, this.debounce)
      }
      else {
        this.emitValueFn()
      }
    },

    // textarea only
    __adjustHeight () {
      const inp = this.$refs.input
      if (inp !== void 0) {
        const parentStyle = inp.parentNode.style

        // reset height of textarea to a small size to detect the real height
        // but keep the total control size the same
        parentStyle.marginBottom = (inp.scrollHeight - 1) + 'px'
        inp.style.height = '1px'

        inp.style.height = inp.scrollHeight + 'px'
        parentStyle.marginBottom = ''
      }
    },

    __onChange (e) {
      this.__onComposition(e)

      clearTimeout(this.emitTimer)
      this.emitValueFn !== void 0 && this.emitValueFn()

      this.$emit('change', e)
    },

    __onFinishEditing (e) {
      e !== void 0 && stop(e)

      clearTimeout(this.emitTimer)
      this.emitValueFn !== void 0 && this.emitValueFn()

      this.typedNumber = false
      this.stopValueWatcher = false
      delete this.tempValue

      this.type !== 'file' && this.$nextTick(() => {
        if (this.$refs.input !== void 0) {
          this.$refs.input.value = this.innerValue !== void 0 ? this.innerValue : ''
        }
      })
    },

    __getControl (h) {
      const on = {
        ...this.$listeners,
        input: this.__onInput,
        paste: this.__onPaste,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        change: this.__onChange,
        blur: this.__onFinishEditing,
        focus: stop
      }

      on.compositionstart = on.compositionupdate = on.compositionend = this.__onComposition

      if (this.hasMask === true) {
        on.keydown = this.__onMaskedKeydown
      }

      const attrs = {
        tabindex: 0,
        'data-autofocus': this.autofocus,
        rows: this.type === 'textarea' ? 6 : void 0,
        'aria-label': this.label,
        ...this.$attrs,
        id: this.targetUid,
        type: this.type,
        maxlength: this.maxlength,
        disabled: this.disable === true,
        readonly: this.readonly === true
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
              : (this.innerValue !== void 0 ? this.innerValue : '')
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
    this.__onFinishEditing()
  }
})
