import { h, defineComponent, computed, inject } from 'vue'

import useQuasar from '../../composables/use-quasar.js'

import { hSlot } from '../../utils/composition-render.js'
import { pageContainerKey, layoutKey } from '../../utils/symbols.js'

export default defineComponent({
  name: 'QPage',

  props: {
    padding: Boolean,
    styleFn: Function
  },

  setup (props, { slots }) {
    const $q = useQuasar()

    const layout = inject(layoutKey)
    inject(pageContainerKey, () => {
      console.error('QPage needs to be child of QPageContainer')
    })

    const style = computed(() => {
      const offset =
        (layout.header.space === true ? layout.header.size : 0) +
        (layout.footer.space === true ? layout.footer.size : 0)

      if (typeof props.styleFn === 'function') {
        const height = layout.container === true
          ? layout.containerHeight.value
          : $q.screen.height

        return props.styleFn(offset, height)
      }

      return {
        minHeight: layout.container === true
          ? (layout.containerHeight.value - offset) + 'px'
          : (
              $q.screen.height === 0
                ? `calc(100vh - ${offset}px)`
                : ($q.screen.height - offset) + 'px'
            )
      }
    })

    const classes = computed(() =>
      `q-page ${props.padding === true ? ' q-layout-padding' : ''}`
    )

    return () => h('main', {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default))
  }
})
