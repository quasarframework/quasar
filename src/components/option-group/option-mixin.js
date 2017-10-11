export default {
  props: {
    label: String,
    leftLabel: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    keepColor: Boolean,
    dark: Boolean,
    disable: Boolean
  },
  computed: {
    innerClasses () {
      if (this.isActive || this.indeterminate) {
        return ['active', `text-${this.color}`]
      }
      else {
        const color = this.keepColor
          ? this.color
          : (this.dark ? 'light' : 'dark')

        return `text-${color}`
      }
    }
  }
}
