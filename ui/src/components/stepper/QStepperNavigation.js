import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QStepperNavigation',

  setup (_, { slots }) {
    return () => h('div', { class: 'q-stepper__nav' }, hSlot(slots.default))
  }
})
