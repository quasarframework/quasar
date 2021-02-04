import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QStepperNavigation',

  mixins: [ ListenersMixin ],

  render (h) {
    return h('div', {
      staticClass: 'q-stepper__nav',
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
