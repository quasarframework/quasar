export default {
  props: {
    autofocus: [Boolean, String],
    name: String,
    maxLength: [Number, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean
  },
  data () {
    return {
      focused: false,
      timer: null,
      isNumberError: false
    }
  },
  computed: {
    inputPlaceholder () {
      if ((!this.floatLabel && !this.stackLabel) || this.labelIsAbove) {
        return this.placeholder
      }
    }
  },
  methods: {
    focus () {
      if (!this.disable) {
        this.$refs.input.focus()
      }
    },
    blur () {
      this.$refs.input.blur()
    },
    select () {
      this.$refs.input.select()
    },

    __onFocus (e) {
      clearTimeout(this.timer)
      this.focused = true
      this.$emit('focus', e)
    },
    __onInputBlur (e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.__onBlur(e)
      }, 200)
    },
    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
      let model = this.isNumber && this.isNumberError ? null : this.model
      if (JSON.stringify(model) !== JSON.stringify(this.value)) {
        this.$emit('input', model)
        this.$emit('change', model)
      }
    },
    __onKeydown (e) {
      this.$emit('keydown', e)
    },
    __onKeyup (e) {
      this.$emit('keyup', e)
    },
    __onClick (e) {
      this.focus()
      this.$emit('click', e)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const input = this.$refs.input
      if (this.autofocus && input) {
        input.focus()
        if (this.autofocus === 'select') {
          input.select()
        }
      }
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
