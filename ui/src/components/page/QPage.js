import { getCurrentInstance, h, inject } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

import usePage, { usePageProps } from './use-page.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/layout/page
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QPage',

  props: usePageProps,

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const $layout = inject(layoutKey, emptyRenderFn)
    if ($layout === emptyRenderFn) {
      console.error('QPage needs to be a deep child of QLayout')
      return emptyRenderFn
    }

    const $pageContainer = inject(pageContainerKey, emptyRenderFn)
    if ($pageContainer === emptyRenderFn) {
      console.error('QPage needs to be child of QPageContainer')
      return emptyRenderFn
    }

    const page = usePage(props, $layout, $q)

    return () =>
      h(
        'main',
        {
          class: page.classes.value,
          style: page.style.value
        },
        hSlot(slots.default)
      )
  }
})
