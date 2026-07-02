import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useItemSection, { useItemSectionProps } from './use-item-section.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/list-and-list-items
 */
/**
 * Section's actual content
 *
 * @api slot default
 */
export default createComponent({
  name: 'QItemSection',

  props: useItemSectionProps,

  setup(props, { slots }) {
    const section = useItemSection(props)

    return () =>
      h('div', { class: section.classes.value }, hSlot(slots.default))
  }
})
