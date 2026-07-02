import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useToolbar, { useToolbarProps } from './use-toolbar.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/toolbar
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QToolbar',

  props: useToolbarProps,

  setup(props, { slots }) {
    const toolbar = useToolbar(props)

    return () =>
      h(
        'div',
        { class: toolbar.classes.value, role: 'toolbar' },
        hSlot(slots.default)
      )
  }
})
