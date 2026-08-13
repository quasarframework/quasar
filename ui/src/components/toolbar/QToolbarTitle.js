import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QToolbarTitle',

  props: {
    shrink: Boolean
  },

  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class:
            'q-toolbar__title ellipsis' + (props.shrink ? ' col-shrink' : '')
        },
        hSlot(slots.default)
      )
  }
})
