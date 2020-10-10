import { h, defineComponent } from 'vue'

import QField from '../field/QField.js'

import { FormFieldMixin } from '../../mixins/form.js'
import { FileValueMixin } from '../../mixins/file.js'
import MaskMixin from '../../mixins/mask.js'
import CompositionMixin from '../../mixins/composition.js'

import { stop } from '../../utils/event.js'

export default defineComponent({
  name: 'QInput',

  inheritAttrs: false,

  mixins: [
    QField,
    MaskMixin,
    CompositionMixin,
    FormFieldMixin,
    FileValueMixin
  ],

  props: {
    modelValue: { required: false },

    shadowText: String,

    type: {
      type: String,
      default: 'text'
    },

    debounce: [ String, Number ],

    autogrow: Boolean, // makes a textarea

    inputClass: [ Array, String, Object ],
    inputStyle: [ Array, String, Object ]
  },

  emits: [ 'paste', 'change' ],

  watch: {
    modelValue (v) {
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
          this.temp.hasOwnProperty('value') === true
        ) {
          if (this.typedNumber === true) {
            this.typedNumber = false
          }
          else {
            delete this.temp.value
          }
        }
      }

      // textarea only
      this.autogrow === true && this.$nextTick(this.__adjustHeight)
    },

    autogrow (autogrow) {
      // textarea only
      if (autogrow === true) {
        this.$nextTick(this.__adjustHeight)
      }
      // if it has a number of rows set respect it
      else if (this.$refs.input && this.$attrs.rows > 0) {
        this.$refs.input.style.height = 'auto'
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
    },

    hasShadow () {
      return this.type !== 'file' &&
        typeof this.shadowText === 'string' &&
        this.shadowText.length > 0
    },

    onEvents () {
      const evt = {
        ...this.qListeners,
        onInput: this.__onInput,
        onPaste: this.__onPaste,
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        onChange: this.__onChange,
        onBlur: this.__onFinishEditing,
        onFocus: stop
      }

      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = this.__onComposition

      if (this.hasMask === true) {
        evt.onKeydown = this.__onMaskedKeydown
      }

      if (this.autogrow === true) {
        evt.onAnimationend = this.__adjustHeight
      }

      return evt
    },

    inputAttrs () {
      const attrs = {
        tabindex: 0,
        'data-autofocus': this.autofocus,
        rows: this.type === 'textarea' ? 6 : void 0,
        'aria-label': this.label,
        name: this.nameProp,
        ...this.qAttrs,
        id: this.targetUid,
        maxlength: this.maxlength,
        disabled: this.disable === true,
        readonly: this.readonly === true
      }

      if (this.isTextarea === false) {
        attrs.type = this.type
      }

      if (this.autogrow === true) {
        attrs.rows = 1
      }

      return attrs
    }
  },

  methods: {
    focus () {
      const el = document.activeElement
      if (
        this.$refs.input &&
        this.$refs.input !== el &&
        // IE can have null document.activeElement
        (el === null || el.id !== this.targetUid)
      ) {
        this.$refs.input.focus()
      }
    },

    select () {
      this.$refs.input && this.$refs.input.select()
    },

    __onPaste (e) {
      if (this.hasMask === true && this.reverseFillMask !== true) {
        const inp = e.target
        this.__moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd)
      }

      this.$emit('paste', e)
    },

    __onInput (e) {
      if (e && e.target && e.target.composing === true) {
        return
      }

      if (this.type === 'file') {
        this.$emit('update:modelValue', e.target.files)
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
          this.temp.hasOwnProperty('value') === true
        ) {
          delete this.temp.value
        }

        if (this.modelValue !== val) {
          stopWatcher === true && (this.stopValueWatcher = true)
          this.$emit('update:modelValue', val)
        }

        this.emitValueFn = void 0
      }

      if (this.type === 'number') {
        this.typedNumber = true
        this.temp.value = val
      }

      if (this.debounce !== void 0) {
        clearTimeout(this.emitTimer)
        this.temp.value = val
        this.emitTimer = setTimeout(this.emitValueFn, this.debounce)
      }
      else {
        this.emitValueFn()
      }
    },

    // textarea only
    __adjustHeight () {
      const inp = this.$refs.input
      if (inp) {
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

      this.$emit('change', e.target.value)
    },

    __onFinishEditing (e) {
      e !== void 0 && stop(e)

      clearTimeout(this.emitTimer)
      this.emitValueFn !== void 0 && this.emitValueFn()

      this.typedNumber = false
      this.stopValueWatcher = false
      delete this.temp.value

      this.type !== 'file' && this.$nextTick(() => {
        if (this.$refs.input) {
          this.$refs.input.value = this.innerValue !== void 0 ? this.innerValue : ''
        }
      })
    },

    __getCurValue () {
      return this.temp.hasOwnProperty('value') === true
        ? this.temp.value
        : (this.innerValue !== void 0 ? this.innerValue : '')
    }
  },

  created () {
    this.temp = {}

    Object.assign(this.field, {
      getControl: () => {
        return h(this.isTextarea === true ? 'textarea' : 'input', {
          ref: 'input',
          class: [
            'q-field__native q-placeholder',
            this.inputClass
          ],
          style: this.inputStyle,
          ...this.inputAttrs,
          ...this.onEvents,
          ...(
            this.type !== 'file'
              ? { value: this.__getCurValue() }
              : this.formDomProps
          )
        })
      },

      getShadowControl: () => {
        return h('div', {
          class: 'q-field__native q-field__shadow absolute-full no-pointer-events'
        }, [
          h('span', { class: 'invisible' }, this.__getCurValue()),
          h('span', this.shadowText)
        ])
      }
    })
  },

  mounted () {
    // textarea only
    this.autogrow === true && this.__adjustHeight()
  },

  beforeUnmount () {
    this.__onFinishEditing()
  }
})
