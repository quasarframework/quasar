import useTab, { useTabEmits, useTabProps } from './use-tab.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/tabs
 */
/**
 * Suggestion: QMenu, QTooltip
 *
 * @api slot default
 */
export default createComponent({
  name: 'QTab',

  props: useTabProps,

  emits: useTabEmits,

  setup(props, { slots, emit }) {
    const { renderTab } = useTab(props, slots, emit)
    return () => renderTab('div')
  }
})
