import { getCurrentInstance, h } from 'vue'

import useCard, { useCardProps } from './use-card.js'
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
  name: 'QCard',

  props: useCardProps,

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const { classes } = useCard(props, $q)

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
})
