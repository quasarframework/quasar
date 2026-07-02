import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useBar, { useBarProps } from './use-bar.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/bar
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QBar',

  props: useBarProps,

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const bar = useBar(props, $q)

    return () =>
      h(
        'div',
        {
          class: bar.classes.value,
          role: 'toolbar'
        },
        hSlot(slots.default)
      )
  }
})
