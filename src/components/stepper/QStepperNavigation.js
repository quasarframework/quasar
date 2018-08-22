export default {
  name: 'QStepperNavigation',
  render (h) {
    return h('div', {
      staticClass: 'q-stepper-nav order-last row items-center'
    }, [
      this.$slots.left,
      h('div', { staticClass: 'col' }),
      this.$slots.default
    ])
  }
}
