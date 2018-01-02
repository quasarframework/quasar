export default {
  name: 'q-stepper-navigation',
  render (h) {
    return h('div', {
      staticClass: 'q-stepper-nav order-last row no-wrap items-center'
    }, [
      this.$slots.left,
      h('div', { staticClass: 'col' }),
      this.$slots.default
    ])
  }
}
