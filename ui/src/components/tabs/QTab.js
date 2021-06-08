import { defineComponent } from 'vue'

import useTab, { useTabProps, useTabEmits } from './use-tab.js'

export default defineComponent({
  name: 'QTab',

  props: useTabProps,

  emits: useTabEmits,

  setup (props, { slots, emit }) {
    const { renderTab } = useTab(props, slots, emit)
    return () => renderTab('div')
  }
})
