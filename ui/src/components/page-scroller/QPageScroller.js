import { h, defineComponent, ref, computed, watch, onBeforeUnmount, Transition } from 'vue'

import usePageSticky, { usePageStickyProps } from '../page-sticky/use-page-sticky.js'
import { getScrollTarget, setScrollPosition } from '../../utils/scroll.js'

export default defineComponent({
  name: 'QPageScroller',

  props: {
    ...usePageStickyProps,

    scrollOffset: {
      type: Number,
      default: 1000
    },

    reverse: Boolean,

    duration: {
      type: Number,
      default: 300
    },

    offset: {
      default: () => [ 18, 18 ]
    }
  },

  emits: [ 'click' ],

  setup (props, { slots, emit }) {
    const { $layout, getStickyContent } = usePageSticky(props)
    const rootRef = ref(null)

    let heightWatcher

    function isVisible () {
      return props.reverse === true
        ? props.height - $layout.scroll.value.position > props.scrollOffset
        : $layout.scroll.value.position > props.scrollOffset
    }

    const showing = ref(isVisible())

    const height = computed(() => (
      $layout.container === true
        ? $layout.containerHeight.value
        : $layout.height.value
    ))

    function updateVisibility () {
      const newVal = isVisible()
      if (showing.value !== newVal) {
        showing.value = newVal
      }
    }

    function updateReverse () {
      if (props.reverse === true) {
        if (heightWatcher === void 0) {
          heightWatcher = watch(height, updateVisibility)
        }
      }
      else {
        cleanup()
      }
    }

    watch($layout.scroll, updateVisibility)
    watch(() => props.reverse, updateReverse)

    function cleanup () {
      if (heightWatcher !== void 0) {
        heightWatcher()
        heightWatcher = void 0
      }
    }

    function onClick (e) {
      const target = $layout.container === true
        ? getScrollTarget(rootRef.value)
        : getScrollTarget($layout.rootRef.value)

      setScrollPosition(
        target,
        props.reverse === true ? $layout.height.value : 0, props.duration
      )

      emit('click', e)
    }

    function getContent () {
      return showing.value === true
        ? h('div', {
            class: 'q-page-scroller',
            onClick
          }, [ getStickyContent(slots) ])
        : null
    }

    updateReverse()

    onBeforeUnmount(cleanup)

    return () => h(
      Transition,
      { name: 'q-transition--fade', ref: rootRef },
      getContent
    )
  }
})
