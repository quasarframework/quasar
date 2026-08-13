import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QBtnGroup',

  props: {
    unelevated: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    square: Boolean,
    push: Boolean,
    stretch: Boolean,
    glossy: Boolean,
    spread: Boolean
  },

  setup(props, { slots }) {
    return () => {
      const cls = [
        'unelevated',
        'outline',
        'flat',
        'rounded',
        'square',
        'push',
        'stretch',
        'glossy'
      ]
        .filter(t => props[t])
        .map(t => `q-btn-group--${t}`)
        .join(' ')

      return h(
        'div',
        {
          class:
            `q-btn-group row no-wrap${cls.length !== 0 ? ' ' + cls : ''}` +
            (props.spread ? ' q-btn-group--spread' : ' inline')
        },
        hSlot(slots.default)
      )
    }
  }
})
