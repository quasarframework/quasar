import { computed, getCurrentInstance, h, inject, provide } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

export default /*#__PURE__*/ createComponent({
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

    const style = computed(() => {
      const css = {}

      if ($layout.header.space) {
        css.paddingTop = `${$layout.header.size}px`
      }
      if ($layout.right.space) {
        css[`padding${$q.lang.rtl ? 'Left' : 'Right'}`] =
          `${$layout.right.size}px`
      }
      if ($layout.footer.space) {
        css.paddingBottom = `${$layout.footer.size}px`
      }
      if ($layout.left.space) {
        css[`padding${$q.lang.rtl ? 'Right' : 'Left'}`] =
          `${$layout.left.size}px`
      }

      return css
    })

    return () =>
      h(
        'div',
        {
          class: 'q-page-container',
          style: style.value
        },
        hSlot(slots.default)
      )
  }
})
