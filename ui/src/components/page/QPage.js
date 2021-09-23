import { h, defineComponent, computed, inject, getCurrentInstance } from 'vue'

import { hSlot } from '../../utils/private/render.js'
import { layoutKey } from '../../utils/private/symbols.js'

export default defineComponent({
  name: 'QPage',

  props: {
    padding: Boolean,
    styleFn: Function
  },

  setup (props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance()

    const $layout = inject(layoutKey, () => {
      console.error('QPage needs to be child of QLayout')
    })

    const style = computed(() => {

      const css = {}

      css.boxSizing = 'content-box'
      
      if ($layout.header.space === true) {
        css.marginTop = `${ $layout.header.size }px`
      }
      if ($layout.right.space === true) {
        css[ `margin${ $q.lang.rtl === true ? 'Left' : 'Right' }` ] = `${ $layout.right.size }px`
      }
      if ($layout.footer.space === true) {
        css.marginBottom = `${ $layout.footer.size }px`
      }
      if ($layout.left.space === true) {
        css[ `margin${ $q.lang.rtl === true ? 'Right' : 'Left' }` ] = `${ $layout.left.size }px`
      }

      const offset
        = ($layout.header.space === true ? $layout.header.size : 0)
        + ($layout.footer.space === true ? $layout.footer.size : 0)

      if (typeof props.styleFn === 'function') {
        const height = $layout.isContainer.value === true
          ? $layout.containerHeight.value
          : $q.screen.height

        return props.styleFn(offset, height)
      }
      
      css.minHeight = $layout.isContainer.value === true
                      ? ($layout.containerHeight.value - offset) + 'px'
                      : (
                          $q.screen.height === 0
                            ? (offset !== 0 ? `calc(100vh - ${ offset }px)` : '100vh')
                            : ($q.screen.height - offset) + 'px'
                        )

      return css
    })

    const classes = computed(() =>
      `q-page ${ props.padding === true ? ' q-layout-padding' : '' }`
    )

    return () => h('main', {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default))
  }
})
