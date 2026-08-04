import useTab, { useTabEmits, useTabProps } from './use-tab.js'

import { createComponent } from '../../utils/private.create/create.js'

export default /*#__PURE__*/ createComponent({
  name: 'QTab',

  props: useTabProps,

  emits: useTabEmits,

  setup(props, { slots, emit }) {
    const { renderTab } = useTab(props, slots, emit)
    return () => renderTab('div')
  }
})
