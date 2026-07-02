import { h } from 'vue'

import useCardActions, { useCardActionsProps } from './use-card-actions.js'
import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/card
 */
/**
 * Suggestions: QBtn
 *
 * @api slot default
 */
export default createComponent({
  name: 'QCardActions',

  props: useCardActionsProps,

  setup(props, { slots }) {
    const { classes } = useCardActions(props)

    return () => h('div', { class: classes.value }, hSlot(slots.default))
  }
})
