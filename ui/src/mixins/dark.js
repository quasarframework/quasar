export default {
  props: {
    dark: Boolean
  },

  computed: {
    isDark () {
      return this.$q.dark.isActive === true || this.dark === true
    }
  }
}
