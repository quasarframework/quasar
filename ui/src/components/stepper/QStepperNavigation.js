import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/stepper
 */
/**
 * The content of the custom navigation, child of a QStep or of a QStepper (globally, through 'navigation' slot)
 *
 * @api slot default
 */
export default createComponent({
  name: 'QStepperNavigation',

  setup(_, { slots }) {
    return () => h('div', { class: 'q-stepper__nav' }, hSlot(slots.default))
  }
})
