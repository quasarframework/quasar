import { getCurrentInstance, h, inject, provide } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

import usePageContainer from './use-page-container.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/layout/page
 */
/**
 * Encapsulates a QPage (either directly or through <router-view>)
 *
 * @api slot default
 */
export default createComponent({
  name: 'QPageContainer',

  setup(_, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const $layout = inject(layoutKey, emptyRenderFn)
    if ($layout === emptyRenderFn) {
      console.error('QPageContainer needs to be child of QLayout')
      return emptyRenderFn
    }

    provide(pageContainerKey, true)

    const container = usePageContainer($layout, $q)

    return () =>
      h(
        'div',
        {
          class: 'q-page-container',
          style: container.style.value
        },
        hSlot(slots.default)
      )
  }
})
