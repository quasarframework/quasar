import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

import usePageSticky, {
  usePageStickyProps
} from '../page-sticky/use-page-sticky.js'
import {
  getScrollTarget,
  setVerticalScrollPosition
} from '../../utils/scroll/scroll.js'

import { createComponent } from '../../utils/private.create/create.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/layout/page-scroller
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */
export default createComponent({
  name: 'QPageScroller',

  props: {
    ...usePageStickyProps,

    /**
     * Scroll offset (in pixels) from which point the component is shown on page; Measured from the top of the page (or from the bottom if in 'reverse' mode)
     *
     * @api prop scroll-offset
     * @type {Number}
     * @default 1000
     * @category behavior
     */
    scrollOffset: {
      type: Number,
      default: 1000
    },

    /**
     * Work in reverse (shows when scrolling to the top of the page and scrolls to bottom when triggered)
     *
     * @api prop reverse
     * @type {Boolean}
     * @category behavior
     */
    reverse: Boolean,

    /**
     * Duration (in milliseconds) of the scrolling until it reaches its target
     *
     * @api prop duration
     * @type {Number}
     * @default 300
     * @category behavior
     */
    duration: {
      type: Number,
      default: 300
    },

    /**
     * @api prop offset
     * @default [18, 18]
     * @category content
     */
    offset: {
      ...usePageStickyProps.offset,
      default: () => [18, 18]
    }
  },

  emits: ['click'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()
    const { $layout, getStickyContent } = usePageSticky()
    const rootRef = ref(null)

    let heightWatcher

    const scrollHeight = computed(
      () =>
        $layout.height.value -
        ($layout.isContainer.value
          ? $layout.containerHeight.value
          : $q.screen.height)
    )

    function isVisible() {
      return props.reverse
        ? scrollHeight.value - $layout.scroll.value.position >
            props.scrollOffset
        : $layout.scroll.value.position > props.scrollOffset
    }

    const showing = ref(isVisible())

    function updateVisibility() {
      const newVal = isVisible()
      if (showing.value !== newVal) {
        showing.value = newVal
      }
    }

    function updateReverse() {
      if (props.reverse) {
        if (heightWatcher === void 0) {
          heightWatcher = watch(scrollHeight, updateVisibility)
        }
      } else {
        cleanup()
      }
    }

    watch($layout.scroll, updateVisibility)
    watch(() => props.reverse, updateReverse)

    function cleanup() {
      if (heightWatcher !== void 0) {
        heightWatcher()
        heightWatcher = void 0
      }
    }

    function onClick(e) {
      const target = getScrollTarget(
        $layout.isContainer.value ? rootRef.value : $layout.rootRef.value
      )

      setVerticalScrollPosition(
        target,
        props.reverse ? $layout.height.value : 0,
        props.duration
      )

      emit('click', e)
    }

    function getContent() {
      return showing.value
        ? h(
            'div',
            {
              ref: rootRef,
              class: 'q-page-scroller',
              onClick
            },
            getStickyContent(slots)
          )
        : null
    }

    updateReverse()

    onBeforeUnmount(cleanup)

    return () => h(Transition, { name: 'q-transition--fade' }, getContent)
  }
})
