import { createComponent } from '../../utils/private.create/create.js'
import usePageSticky, { usePageStickyProps } from './use-page-sticky.js'

export default createComponent({
  name: 'QPageSticky',

  props: usePageStickyProps,

  setup (_, { slots }) {
    const { getStickyContent } = usePageSticky()
    return () => getStickyContent(slots)
  }
})
