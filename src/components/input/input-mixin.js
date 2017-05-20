export default {
  props: {
    autofocus: Boolean,
    pattern: String,
    name: String,
    maxlength: Number,
    maxHeight: Number,
    placeholder: String
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

    __onFocus (e) {
      this.focused = true
      this.$emit('focus', e)
    },
    __onBlur (e) {
      this.focused = false
      this.$emit('blur', e)
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
      }
    })
  }
}
