import { computed, h } from 'vue'

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
    const classes = computed(
      () =>
        'q-avatar' +
        (props.color ? ` bg-${props.color}` : '') +
        (props.textColor ? ` text-${props.textColor} q-chip--colored` : '') +
        (props.square
          ? ' q-avatar--square'
          : props.rounded
            ? ' rounded-borders'
            : '')
    )

    const contentStyle = computed(() =>
      props.fontSize ? { fontSize: props.fontSize } : null
    )

    return () => {
      const icon =
        props.icon !== void 0 ? [h(QIcon, { name: props.icon })] : void 0

      const data = { class: classes.value }
      if (props.size !== void 0) {
        data.style = getSizeStyle(props.size)
      }

      return h('div', data, [
        h(
          'div',
          {
            class: 'q-avatar__content row flex-center overflow-hidden',
            style: contentStyle.value
          },
          hMergeSlotSafely(slots.default, icon)
        )
      ])
    }
  }
})
