import { h } from 'vue'

import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/tab-panels
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup(_, { slots }) {
    return () =>
      h('div', { class: 'q-tab-panel', role: 'tabpanel' }, hSlot(slots.default))
  }
})
