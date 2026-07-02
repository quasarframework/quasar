import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

import useBadge, { useBadgeProps } from './use-badge.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/badge
 */
/**
 * This is where QBadge content goes, if not using 'label' property
 *
 * @api slot default
 */
export default createComponent({
  name: 'QBadge',

  props: useBadgeProps,

  setup(props, { slots }) {
    const badge = useBadge(props)

    return () =>
      h(
        'div',
        {
          class: badge.classes.value,
          style: badge.style.value,
          role: 'status',
          'aria-label': props.label
        },
        hMergeSlot(slots.default, props.label !== void 0 ? [props.label] : [])
      )
  }
})
