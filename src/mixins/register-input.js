export default {
  inject: {
    field: {
      from: '__field',
      default: null
    }
  },
  beforeMount () {
    if (this.field) {
      this.field.__registerInput(this)
    }
  },
  beforeDestroy () {
    if (this.field) {
      this.field.__unregisterInput()
    }
  }
}
