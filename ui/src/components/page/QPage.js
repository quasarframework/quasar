import { computed, h, inject } from 'vue'

import useQuasar from '../../composables/use-quasar/use-quasar.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  layoutKey,
  pageContainerKey
} from '../../utils/private.symbols/symbols.js'

export default /*#__PURE__*/ createComponent({
  name: 'QPage',

  props: {
    padding: Boolean,
    styleFn: Function
  },

  setup(props, { slots }) {
    const $q = useQuasar()

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

    const style = computed(() => {
      const offset =
        ($layout.header.space ? $layout.header.size : 0) +
        ($layout.footer.space ? $layout.footer.size : 0)

      if (typeof props.styleFn === 'function') {
        const height = $layout.isContainer.value
          ? $layout.containerHeight.value
          : $q.screen.height

        return props.styleFn(offset, height)
      }

      return {
        minHeight: $layout.isContainer.value
          ? $layout.containerHeight.value - offset + 'px'
          : $q.screen.height === 0
            ? offset !== 0
              ? `calc(100vh - ${offset}px)`
              : '100vh'
            : $q.screen.height - offset + 'px'
      }
    })

    const classes = computed(
      () => `q-page${props.padding ? ' q-layout-padding' : ''}`
    )

    return () =>
      h(
        'main',
        {
          class: classes.value,
          style: style.value
        },
        hSlot(slots.default)
      )
  }
})
