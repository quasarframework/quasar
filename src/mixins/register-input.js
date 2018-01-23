export default {
  inject: {
    __field: { default: null }
  },
  methods: {
    __registerInput (update) {
      this.field.__registerInput(this)
    }
  },
  mounted () {
    if (this.__field) {
      this.field = this.__field
      this.__registerInput()
    }
  },
  beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput()
    }
  }
}
