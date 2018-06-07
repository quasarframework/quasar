export default {
  name: 'QListHeader',
  props: {
    inset: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'q-list-header',
      'class': {
        'q-list-header-inset': this.inset
      }
    }, this.$slots.default)
  }
}
