export default {
  inject: {
    field: {
      from: '__field',
      default: null
    }
  },
  methods: {
    __registerInput () {
      this.field.__registerInput(this)
    }
  },
  beforeMount () {
    if (this.field) {
      this.__registerInput()
    }
  },
  beforeDestroy () {
    if (this.field) {
      this.field.__unregisterInput()
    }
  }
}
