export default {
  name: 'QCardSection',
  render (h) {
    return h('div', {
      staticClass: 'q-card__section relative-position'
    }, this.$slots.default)
  }
}
