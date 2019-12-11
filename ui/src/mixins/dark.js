export default {
  props: {
    dark: {
      type: Boolean,
      default: null
    }
  },

  computed: {
    isDark () {
      return this.dark === null
        ? this.$q.dark.isActive
        : this.dark
    }
  }
}
