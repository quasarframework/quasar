export default {
  props: {
    autofocus: Boolean,
    name: String,
    maxLength: [Number, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean
  },
  data () {
    return {
      focused: false,
      timer: null
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
      if (JSON.stringify(this.model) !== JSON.stringify(this.value)) {
        this.$emit('input', this.model)
        this.$emit('change', this.model)
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
      }
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
