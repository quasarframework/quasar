import { defineComponent } from 'vue'

import usePageSticky, { usePageStickyProps } from './use-page-sticky'

export default defineComponent({
  name: 'QPageSticky',

  props: usePageStickyProps,

  setup (props, { slots }) {
    const { getStickyContent } = usePageSticky(props)
    return () => getStickyContent(slots)
  }
})
