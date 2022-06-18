import Vue from 'vue'

import QField from '../field/QField.js'

import { FormFieldMixin } from '../../mixins/form.js'
import { FileValueMixin } from '../../mixins/file.js'
import MaskMixin from '../../mixins/mask.js'
import CompositionMixin from '../../mixins/composition.js'
import ListenersMixin from '../../mixins/listeners.js'

import { stop } from '../../utils/event.js'
import { addFocusFn } from '../../utils/focus-manager.js'

export default Vue.extend({
  name: 'QInput',

  mixins: [
    QField,
    MaskMixin,
    CompositionMixin,
    FormFieldMixin,
    FileValueMixin,
    ListenersMixin
  ],

  props: {
    value: { required: false },

    shadowText: String,

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

          if (String(v) === this.emitCachedValue) {
            return
          }
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
      this.autogrow === true && this.$nextTick(this.__adjustHeight)
    },

    // some browsers lose the native input value
    // so we need to reattach it dynamically
    // (like type="password" <-> type="text"; see #12078)
    type () {
      if (this.$refs.input) {
        this.$refs.input.value = this.value
      }
    },

    autogrow (autogrow) {
      // textarea only
      if (autogrow === true) {
        this.$nextTick(this.__adjustHeight)
      }
      // if it has a number of rows set respect it
      else if (this.qAttrs.rows > 0 && this.$refs.input !== void 0) {
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

    isTypeText () {
      return this.isTextarea === true || ['text', 'search', 'url', 'tel', 'password'].includes(this.type)
    },

    fieldClass () {
      return `q-${this.isTextarea === true ? 'textarea' : 'input'}` +
        (this.autogrow === true ? ' q-textarea--autogrow' : '')
    },

    hasShadow () {
      return this.type !== 'file' &&
        typeof this.shadowText === 'string' &&
        this.shadowText.length > 0
    },

    onEvents () {
      const on = {
        ...this.qListeners,
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

      if (this.autogrow === true) {
        on.animationend = this.__adjustHeight
      }

      return on
    },

    inputAttrs () {
      const attrs = {
        tabindex: 0,
        'data-autofocus': this.autofocus || void 0,
        rows: this.type === 'textarea' ? 6 : void 0,
        'aria-label': this.label,
        name: this.nameProp,
        ...this.qAttrs,
        id: this.targetUid,
        type: this.type,
        maxlength: this.maxlength,
        disabled: this.disable === true,
        readonly: this.readonly === true
      }

      if (this.autogrow === true) {
        attrs.rows = 1
      }

      return attrs
    }
  },

  methods: {
    focus () {
      addFocusFn(() => {
        const el = document.activeElement
        if (
          this.$refs.input !== void 0 &&
          this.$refs.input !== el &&
          // IE can have null document.activeElement
          (el === null || el.id !== this.targetUid)
        ) {
          this.$refs.input.focus({ preventScroll: true })
        }
      })
    },

    select () {
      this.$refs.input !== void 0 && this.$refs.input.select()
    },

    getNativeElement () {
      return this.$refs.input
    },

    __onPaste (e) {
      if (this.hasMask === true && this.reverseFillMask !== true) {
        const inp = e.target
        this.__moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd)
      }

      this.$emit('paste', e)
    },

    __onInput (e) {
      if (!e || !e.target || e.target.qComposing === true) {
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

        if (this.isTypeText === true && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target

          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            this.$nextTick(() => {
              if (e.target === document.activeElement && val.indexOf(e.target.value) === 0) {
                e.target.setSelectionRange(selectionStart, selectionEnd)
              }
            })
          }
        }
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

        if (this.value !== val && this.emitCachedValue !== val) {
          this.emitCachedValue = val

          stopWatcher === true && (this.stopValueWatcher = true)
          this.$emit('input', val)

          this.$nextTick(() => {
            this.emitCachedValue === val && (this.emitCachedValue = NaN)
          })
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
        const { overflow } = inp.style

        // reset height of textarea to a small size to detect the real height
        // but keep the total control size the same
        parentStyle.marginBottom = (inp.scrollHeight - 1) + 'px'
        inp.style.height = '1px'
        inp.style.overflow = 'hidden'

        inp.style.height = inp.scrollHeight + 'px'
        inp.style.overflow = overflow
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

      // we need to use setTimeout instead of this.$nextTick
      // to avoid a bug where focusout is not emitted for type date/time/week/...
      this.type !== 'file' && setTimeout(() => {
        if (this.$refs.input !== void 0) {
          this.$refs.input.value = this.innerValue !== void 0 ? this.innerValue : ''
        }
      })
    },

    __getCurValue () {
      return this.hasOwnProperty('tempValue') === true
        ? this.tempValue
        : (this.innerValue !== void 0 ? this.innerValue : '')
    },

    __getShadowControl (h) {
      return h('div', {
        staticClass: 'q-field__native q-field__shadow absolute-bottom no-pointer-events' +
          (this.isTextarea === true ? '' : ' text-no-wrap')
      }, [
        h('span', { staticClass: 'invisible' }, this.__getCurValue()),
        h('span', this.shadowText)
      ])
    },

    __getControl (h) {
      return h(this.isTextarea === true ? 'textarea' : 'input', {
        ref: 'input',
        staticClass: 'q-field__native q-placeholder',
        style: this.inputStyle,
        class: this.inputClass,
        attrs: this.inputAttrs,
        on: this.onEvents,
        domProps: this.type !== 'file'
          ? { value: this.__getCurValue() }
          : this.formDomProps
      })
    }
  },

  created () {
    this.emitCachedValue = NaN
  },

  mounted () {
    // textarea only
    this.autogrow === true && this.__adjustHeight()
  },

  beforeDestroy () {
    this.__onFinishEditing()
  }
})
