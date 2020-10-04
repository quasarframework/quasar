import { h, defineComponent } from 'vue'

import { slot } from '../../utils/render.js'

export default defineComponent({
  name: 'QStepperNavigation',

  render () {
    return h('div', { class: 'q-stepper__nav' }, slot(this, 'default'))
  }
})
