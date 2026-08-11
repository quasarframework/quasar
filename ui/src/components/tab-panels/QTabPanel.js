import { h } from 'vue'

import { usePanelChildProps } from '../../composables/private.use-panel/use-panel.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QTabPanel',

  props: usePanelChildProps,

  setup(_, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'q-tab-panel',
          role: 'tabpanel',
          // per the WAI-ARIA tabs pattern, so that keyboard users can
          // reach the panel content even when nothing in it is focusable
          tabindex: 0
        },
        hSlot(slots.default)
      )
  }
})
