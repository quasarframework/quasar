export default {
  inject: {
    __field: { default: null }
  },
  methods: {
    __registerInput () {
      if (this.__field) {
        this.field = this.__field
        this.field.__registerInput(this)
      }
    }
  },
  created () {
    this.__registerInput()
  },
  updated () {
    this.__registerInput()
  },
  beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput()
    }
  }
}
