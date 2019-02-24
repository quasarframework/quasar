import Vue from 'vue'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QStepperNavigation',

  render (h) {
    return h('div', {
      staticClass: 'q-stepper__nav',
      on: this.$listeners
    }, slot(this, 'default'))
  }
})
