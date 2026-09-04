import { h, onMounted, onUpdated, ref } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'

/**
 * We are using a sub-component so that the fetching state flips of a
 * load re-render the loading indicator alone and not the QInfiniteScroll
 * content.
 */
export default /*#__PURE__*/ createComponent({
  props: ['store'],

  setup(props, { slots }) {
    const rootRef = ref(null)

    // we need to pause svg animations (if any) when hiding
    // otherwise the browser will keep on recalculating the style
    function updateSvgAnimations() {
      const action = `${props.store.isFetching.value ? 'un' : ''}pauseAnimations`

      for (const el of rootRef.value.getElementsByTagName('svg')) {
        el[action]()
      }
    }

    onMounted(updateSvgAnimations)
    onUpdated(updateSvgAnimations)

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class:
            'q-infinite-scroll__loading' +
            (props.store.isFetching.value ? '' : ' invisible')
        },
        hSlot(slots.default)
      )
  }
})
