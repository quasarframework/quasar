import { getCurrentInstance, h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useList, { useListProps } from './use-list.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/list-and-list-items
 */
/**
 * This is where the content goes; Suggestion: QItem, QExpansionItem, ...
 *
 * @api slot default
 */
export default createComponent({
  name: 'QList',

  props: useListProps,

  setup(props, { slots }) {
    const vm = getCurrentInstance()
    const list = useList(props, vm.proxy.$q)

    return () =>
      h(
        props.tag,
        { class: list.classes.value, role: list.role.value },
        hSlot(slots.default)
      )
  }
})
