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
    disable: Boolean,
    noFocus: Boolean
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
    },
    focusable () {
      return !this.noFocus && !this.disable
    },
    tabindex () {
      return this.focusable ? 0 : null
    }
  }
}
