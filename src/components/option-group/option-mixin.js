export default {
  props: {
    label: String,
    leftLabel: Boolean,
    color: String,
    disable: Boolean
  },
  computed: {
    classes () {
      if (this.isActive || this.indeterminate) {
        const cls = []
        cls.push('active')
        if (this.color) {
          cls.push(`text-${this.color}`)
        }
        return cls
      }
    }
  }
}
