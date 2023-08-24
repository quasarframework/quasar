import useTab, { useTabProps, useTabEmits } from './use-tab.js'

import { createComponent } from '../../utils/private/create.js'

export default createComponent({
  name: 'QTab',

  props: useTabProps,

  emits: useTabEmits,

  setup (props, { slots, emit }) {
    const { renderTab } = useTab(props, slots, emit)
    return () => renderTab('div')
  }
})
