import { h } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

import useBtnGroup, { useBtnGroupProps } from './use-btn-group.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/button-group
 */
/**
 * Suggestion: QBtn
 *
 * @api slot default
 */
export default createComponent({
  name: 'QBtnGroup',

  props: useBtnGroupProps,

  setup(props, { slots }) {
    const group = useBtnGroup(props)

    return () => h('div', { class: group.classes.value }, hSlot(slots.default))
  }
})
