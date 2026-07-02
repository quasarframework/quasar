import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useToolbarTitle, { useToolbarTitleProps } from './use-toolbar-title.js'

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
  name: 'QToolbarTitle',

  props: useToolbarTitleProps,

  setup(props, { slots }) {
    const title = useToolbarTitle(props)

    return () => h('div', { class: title.classes.value }, hSlot(slots.default))
  }
})
