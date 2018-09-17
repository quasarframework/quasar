export default {
  name: 'QToolbar',
  props: {
    color: String,
    textColor: String,
    glossy: Boolean
  },
  computed: {
    classes () {
      return {
        [`bg-${this.color}`]: this.color,
        [`text-${this.textColor}`]: this.textColor,
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
