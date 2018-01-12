export default {
  name: 'q-card-separator',
  props: {
    inset: Boolean
  },
  render (h) {
    return h('div', {
      staticClass: 'q-card-separator',
      'class': { inset: this.inset }
    }, [
      this.$slots.default
    ])
  }
}
