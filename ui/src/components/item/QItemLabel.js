import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useItemLabel, { useItemLabelProps } from './use-item-label.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/list-and-list-items
 */
/**
 * The content of the label; Suggestion: text
 *
 * @api slot default
 */
export default createComponent({
  name: 'QItemLabel',

  props: useItemLabelProps,

  setup(props, { slots }) {
    const label = useItemLabel(props)

    return () =>
      h(
        'div',
        {
          style: label.style.value,
          class: label.classes.value
        },
        hSlot(slots.default)
      )
  }
})
