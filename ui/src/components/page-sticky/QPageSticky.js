import { createComponent } from '../../utils/private.create/create.js'
import usePageSticky, { usePageStickyProps } from './use-page-sticky.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/layout/page-sticky
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QPageSticky',

  props: usePageStickyProps,

  setup(_, { slots }) {
    const { getStickyContent } = usePageSticky()
    return () => getStickyContent(slots)
  }
})
