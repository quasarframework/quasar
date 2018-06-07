export default {
  name: 'QCardSeparator',
  props: {
    inset: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card-separator',
      'class': { inset: this.inset }
    }, this.$slots.default)
  }
}
