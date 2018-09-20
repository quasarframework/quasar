export default {
  name: 'QList',
  props: {
    bordered: Boolean,
    dense: Boolean,
    dark: Boolean
  },
  computed: {
    classes () {
      return {
        'q-list--bordered': this.bordered,
        'q-list--dense': this.dense,
        'q-list--dark': this.dark
      }
    }
  },
  render (h) {
    return h('div', {
      staticClass: 'q-list',
      'class': this.classes
    }, this.$slots.default)
  }
}
