import { h } from 'vue'

import QIcon from '../icon/QIcon.js'

import {
  getSizeStyle,
  useSizeProps
} from '../../composables/private.use-size/use-size.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlotSafely } from '../../utils/private.render/render.js'

export default /*#__PURE__*/ createComponent({
  name: 'QAvatar',

  props: {
    ...useSizeProps,

    fontSize: String,

    color: String,
    textColor: String,

    icon: String,
    square: Boolean,
    rounded: Boolean
  },

  setup(props, { slots }) {
    return () => {
      const icon =
        props.icon !== void 0 ? [h(QIcon, { name: props.icon })] : void 0

      const data = {
        class:
          'q-avatar' +
          (props.color ? ` bg-${props.color}` : '') +
          (props.textColor ? ` text-${props.textColor} q-chip--colored` : '') +
          (props.square
            ? ' q-avatar--square'
            : props.rounded
              ? ' rounded-borders'
              : '')
      }
      if (props.size !== void 0) {
        data.style = getSizeStyle(props.size)
      }

      return h('div', data, [
        h(
          'div',
          {
            class: 'q-avatar__content row flex-center overflow-hidden',
            style: props.fontSize ? { fontSize: props.fontSize } : null
          },
          hMergeSlotSafely(slots.default, icon)
        )
      ])
    }
  }
})
