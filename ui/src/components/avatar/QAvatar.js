import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlotSafely } from '../../utils/private.render/render.js'

import useAvatar, { useAvatarProps } from './use-avatar.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/avatar
 */
/**
 * Optional; Suggestions: one character string, <img> tag
 *
 * @api slot default
 */
export default createComponent({
  name: 'QAvatar',

  props: useAvatarProps,

  setup(props, { slots }) {
    const avatar = useAvatar(props)

    return () =>
      h(
        'div',
        {
          class: avatar.classes.value,
          style: avatar.sizeStyle.value
        },
        [
          h(
            'div',
            {
              class: 'q-avatar__content row flex-center overflow-hidden',
              style: avatar.contentStyle.value
            },
            hMergeSlotSafely(slots.default, avatar.getIcon())
          )
        ]
      )
  }
})
