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
  watch: {
    noParentField (val) {
      if (!this.field) {
        return
      }
      this.field[val ? '__registerInput' : '__unregisterInput'](this)
    }
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
