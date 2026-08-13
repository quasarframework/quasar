import { h } from 'vue'

import useAlign, {
  useAlignProps
} from '../../composables/private.use-align/use-align.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QCardActions',

  props: {
    ...useAlignProps,
    vertical: Boolean
  },

  setup(props, { slots }) {
    const alignClass = useAlign(props)

    return () =>
      h(
        'div',
        {
          class:
            `q-card__actions ${alignClass()}` +
            ` q-card__actions--${props.vertical ? 'vert column' : 'horiz row'}`
        },
        hSlot(slots.default)
      )
  }
})
