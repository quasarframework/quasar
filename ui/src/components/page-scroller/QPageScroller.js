import { h, defineComponent, ref, computed, watch, onBeforeUnmount, getCurrentInstance, Transition } from 'vue'

import usePageSticky, { usePageStickyProps } from '../page-sticky/use-page-sticky.js'
import { getScrollTarget, setVerticalScrollPosition } from '../../utils/scroll.js'

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
    const { proxy: { $q } } = getCurrentInstance()
    const { $layout, getStickyContent } = usePageSticky()
    const rootRef = ref(null)

    let heightWatcher

    const scrollHeight = computed(() => $layout.height.value - (
      $layout.isContainer.value === true
        ? $layout.containerHeight.value
        : $q.screen.height
    ))

    function isVisible () {
      return props.reverse === true
        ? scrollHeight.value - $layout.scroll.value.position > props.scrollOffset
        : $layout.scroll.value.position > props.scrollOffset
    }

    const showing = ref(isVisible())

    function updateVisibility () {
      const newVal = isVisible()
      if (showing.value !== newVal) {
        showing.value = newVal
      }
    }

    function updateReverse () {
      if (props.reverse === true) {
        if (heightWatcher === void 0) {
          heightWatcher = watch(scrollHeight, updateVisibility)
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
      const target = getScrollTarget(
        $layout.isContainer.value === true
          ? rootRef.value
          : $layout.rootRef.value
      )

      setVerticalScrollPosition(
        target,
        props.reverse === true ? $layout.height.value : 0,
        props.duration
      )

      emit('click', e)
    }

    function getContent () {
      return showing.value === true
        ? h('div', {
            ref: rootRef,
            class: 'q-page-scroller',
            onClick
          }, getStickyContent(slots))
        : null
    }

    updateReverse()

    onBeforeUnmount(cleanup)

    return () => h(
      Transition,
      { name: 'q-transition--fade' },
      getContent
    )
  }
})
