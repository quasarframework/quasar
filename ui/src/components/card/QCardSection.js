import { h } from 'vue'

import useCardSection, { useCardSectionProps } from './use-card-section.js'
import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/card
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QCardSection',

  props: useCardSectionProps,

  setup(props, { slots }) {
    const { classes } = useCardSection(props)

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
