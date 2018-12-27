import Vue from 'vue'

export default Vue.extend({
  name: 'QStepperNavigation',

  render (h) {
    return h('div', {
      staticClass: 'q-stepper__nav'
    }, this.$slots.default)
  }
})
