import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QItemSection',

  props: {
    avatar: Boolean,
    thumbnail: Boolean,
    side: Boolean,
    top: Boolean,
    noWrap: Boolean
  },

  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class:
            'q-item__section column' +
            ` q-item__section--${props.avatar || props.side || props.thumbnail ? 'side' : 'main'}` +
            (props.top
              ? ' q-item__section--top justify-start'
              : ' justify-center') +
            (props.avatar ? ' q-item__section--avatar' : '') +
            (props.thumbnail ? ' q-item__section--thumbnail' : '') +
            (props.noWrap ? ' q-item__section--nowrap' : '')
        },
        hSlot(slots.default)
      )
  }
})
