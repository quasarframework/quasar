import Vue from 'vue'

import QField from '../field/QField.js'

import MaskMixin from '../../mixins/mask.js'
import debounce from '../../utils/debounce.js'
import { stop } from '../../utils/event.js'
import Platform from '../../plugins/Platform.js'

function cloneFileList (original) {
  if (Platform.is.ie === true) {
    return original
  }

  const dataTransfer = new ClipboardEvent('').clipboardData || // Firefox < 62 workaround exploiting https://bugzilla.mozilla.org/show_bug.cgi?id=1422655
    new DataTransfer() // specs compliant (as of March 2018 only Chrome)

  Array.from(original).forEach(file => {
    dataTransfer.items.add(file)
  })

  return dataTransfer.files
}

export default Vue.extend({
  name: 'QInput',

  mixins: [ QField, MaskMixin ],

  props: {
    value: {},

    type: {
      type: String,
      default: 'text'
    },

    debounce: [String, Number],

    maxlength: [Number, String],
    autogrow: Boolean, // makes a textarea
    autofocus: Boolean,

    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },

  watch: {
    value: {
      handler (v) {
        if (this.hasMask === true) {
          if (this.stopValueWatcher === true) {
            this.stopValueWatcher = false
            return
          }

          this.__updateMaskValue(v)
        }
        else if (this.type === 'file') {
          this.innerValue = v
          if (this.$refs.input !== void 0 && v !== this.$refs.input.files) {
            if ((v instanceof FileList) === true) {
              // This is needed so that objects remain different
              Platform.is.ie !== true && (this.$refs.input.files = cloneFileList(v))
            }
            else {
              this.$refs.input.value = ''
            }
          }
        }
        else if (this.innerValue !== v) {
          this.innerValue = v
        }

        // textarea only
        this.autogrow === true && this.$nextTick(this.__adjustHeightDebounce)
      },
      immediate: true
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
      return `q-${this.isTextarea === true ? 'textarea' : 'input'}` +
        (this.autogrow === true ? ' q-textarea--autogrow' : '')
    }
  },

  methods: {
    focus () {
      this.$refs.input.focus()
    },

    __onInput (e) {
      if (this.type === 'file') {
        // This is needed so that Vue detects the change
        const files = cloneFileList(e.target.files)

        this.$refs.input.files !== files && (this.$refs.input.files = files)

        this.$emit('input', files)
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
        if (this.hasOwnProperty('tempValue') === true) {
          delete this.tempValue
        }
        if (this.value !== val) {
          stopWatcher === true && (this.stopValueWatcher = true)
          this.$emit('input', val)
        }
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
      inp.style.height = '1px'
      inp.style.height = inp.scrollHeight + 'px'
    },

    __getControl (h) {
      const on = {
        ...this.$listeners,
        input: this.__onInput,
        focus: stop,
        blur: stop
      }

      if (this.hasMask === true) {
        on.keydown = this.__onMaskedKeydown
      }

      const attrs = {
        tabindex: 0,
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
    this.autofocus === true && this.$nextTick(this.focus)
  },

  beforeDestroy () {
    clearTimeout(this.emitTimer)
  }
})
