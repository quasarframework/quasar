export default {
  name: 'QCardMain',
  render (h) {
    return h('div', {
      staticClass: 'q-card-main q-card-container'
    }, this.$slots.default)
  }
}
