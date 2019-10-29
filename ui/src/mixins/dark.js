export default {
  props: {
    dark: {
      type: Boolean,
      default: null
    }
  },

  computed: {
    isDark () {
      return this.dark === false
        ? false
        : this.$q.dark.isActive === true || this.dark === true
    }
  }
}
