import { h, computed, provide, inject, getCurrentInstance } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'
import { pageContainerKey, layoutKey, emptyRenderFn } from '../../utils/private/symbols.js'

export default createComponent({
  name: 'QPageContainer',

  setup (_, { slots }) {
    const { proxy: { $q } } = getCurrentInstance()

    const $layout = inject(layoutKey, emptyRenderFn)
    if ($layout === emptyRenderFn) {
      console.error('QPageContainer needs to be child of QLayout')
      return emptyRenderFn
    }

    provide(pageContainerKey, true)

    const style = computed(() => {
      const css = {}

      if ($layout.header.space === true) {
        css.paddingTop = `${ $layout.header.size }px`
      }
      if ($layout.right.space === true) {
        css[ `padding${ $q.lang.rtl === true ? 'Left' : 'Right' }` ] = `${ $layout.right.size }px`
      }
      if ($layout.footer.space === true) {
        css.paddingBottom = `${ $layout.footer.size }px`
      }
      if ($layout.left.space === true) {
        css[ `padding${ $q.lang.rtl === true ? 'Right' : 'Left' }` ] = `${ $layout.left.size }px`
      }

      return css
    })

    return () => h('div', {
      class: 'q-page-container',
      style: style.value
    }, hSlot(slots.default))
  }
})
