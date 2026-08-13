import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QCardSection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    horizontal: Boolean
  },

  setup(props, { slots }) {
    return () =>
      h(
        props.tag,
        {
          class:
            'q-card__section' +
            ` q-card__section--${props.horizontal ? 'horiz row no-wrap' : 'vert'}`
        },
        hSlot(slots.default)
      )
  }
})
