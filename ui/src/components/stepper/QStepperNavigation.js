import { h } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

export default createComponent({
  name: 'QStepperNavigation',

  setup (_, { slots }) {
    return () => h('div', { class: 'q-stepper__nav' }, hSlot(slots.default))
  }
})
