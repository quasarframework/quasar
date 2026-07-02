import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useMarkupTable, { useMarkupTableProps } from './use-markup-table.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/markup-table
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QMarkupTable',

  props: useMarkupTableProps,

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const table = useMarkupTable(props, vm.proxy.$q)

    return () =>
      h(
        'div',
        {
          class: table.classes.value
        },
        [h('table', { class: 'q-table' }, hSlot(slots.default))]
      )
  }
})
