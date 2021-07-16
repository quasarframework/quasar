import { defineComponent } from 'vue'

import usePageSticky, { usePageStickyProps } from './use-page-sticky'

export default defineComponent({
  name: 'QPageSticky',

  props: usePageStickyProps,

  setup (_, { slots }) {
    const { getStickyContent } = usePageSticky()
    return () => getStickyContent(slots)
  }
})
