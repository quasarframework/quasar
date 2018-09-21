export default {
  name: 'QToolbar',
  props: {
    glossy: Boolean
  },
  computed: {
    classes () {
      return {
        'glossy': this.glossy
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-toolbar row no-wrap items-center relative-position',
      'class': this.classes
    }, this.$slots.default)
  }
}
