import { h, defineComponent } from 'vue'

import { hSlot } from '../../utils/render.js'

export default defineComponent({
  name: 'QStepperNavigation',

  render () {
    return h('div', { class: 'q-stepper__nav' }, hSlot(this, 'default'))
  }
})
