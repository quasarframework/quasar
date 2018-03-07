export default {
  inject: {
    field: {
      from: '__field',
      default: null
    }
  },
  props: {
    noParentField: Boolean
  },
  beforeMount () {
    if (!this.noParentField && this.field) {
      this.field.__registerInput(this)
    }
  },
  beforeDestroy () {
    if (!this.noParentField && this.field) {
      this.field.__unregisterInput(this)
    }
  }
}
