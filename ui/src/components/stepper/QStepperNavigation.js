import { h, defineComponent } from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QStepperNavigation',

  mixins: [ ListenersMixin ],

  render () {
    return h('div', {
      staticClass: 'q-stepper__nav',
      on: { ...this.qListeners }
    }, slot(this, 'default'))
  }
})
