import Vue from 'vue'
export default Vue.extend({
  name: 'QStepperNavigation',

  render (h) {
    return h('div', {
      staticClass: 'q-stepper__nav order-last row items-center'
    }, [
      this.$slots.left,
      h('div', { staticClass: 'col' }),
      this.$slots.default
    ])
  }
})
