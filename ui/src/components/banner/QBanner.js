import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useBanner, { useBannerProps } from './use-banner.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/banner
 */
/**
 * This is where Banner content goes
 *
 * @api slot default
 */

/**
 * Slot for displaying an avatar (suggestions: QIcon, QAvatar)
 *
 * @api slot avatar
 */

/**
 * Slot for Banner action (suggestions: QBtn)
 *
 * @api slot action
 */
export default createComponent({
  name: 'QBanner',

  props: useBannerProps,

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const banner = useBanner(props, $q)

    return () => {
      const child = [
        h(
          'div',
          {
            class: 'q-banner__avatar col-auto row items-center self-start'
          },
          hSlot(slots.avatar)
        ),

        h(
          'div',
          {
            class: 'q-banner__content col text-body2'
          },
          hSlot(slots.default)
        )
      ]

      const actions = hSlot(slots.action)
      if (actions !== void 0) {
        child.push(h('div', { class: banner.actionClass.value }, actions))
      }

      return h(
        'div',
        {
          class:
            banner.classes.value +
            (!props.inlineActions && actions !== void 0
              ? ' q-banner--top-padding'
              : ''),
          role: 'alert'
        },
        child
      )
    }
  }
})
