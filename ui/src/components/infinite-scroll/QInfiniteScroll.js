import {
  computed,
  getCurrentInstance,
  h,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  shallowRef,
  watch
} from 'vue'

import InfiniteScrollLoading from './InfiniteScrollLoading.js'

import useIntersection from '../../composables/use-intersection/use-intersection.js'

import { createComponent } from '../../utils/private.create/create.js'
import debounce from '../../utils/debounce/debounce.js'
import { height } from '../../utils/dom/dom.js'
import {
  getScrollHeight,
  getScrollTarget,
  getVerticalScrollPosition,
  scrollTargetProp,
  setVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import {
  addPreventScrollReleaseListener,
  removePreventScrollReleaseListener
} from '../../utils/scroll/prevent-scroll.js'
import { hUniqueSlot } from '../../utils/private.render/render.js'

function isInFixedSubtree(el) {
  while (el !== null && el !== document.body) {
    if (window.getComputedStyle(el).position === 'fixed') {
      return true
    }
    el = el.parentElement
  }
  return false
}

export default /*#__PURE__*/ createComponent({
  name: 'QInfiniteScroll',

  props: {
    offset: {
      type: Number,
      default: 500
    },

    debounce: {
      type: [String, Number],
      default: 100
    },

    scrollTarget: scrollTargetProp,

    initialIndex: {
      type: Number,
      default: 0
    },

    disable: Boolean,
    reverse: Boolean
  },

  emits: ['load'],

  setup(props, { slots, emit }) {
    const isFetching = ref(false)
    const isWorking = ref(true)
    const suppressAnchoring = ref(false)
    const rootRef = ref(null)
    const sentinelRef = ref(null)
    const scrollTargetRef = shallowRef(null)

    const store = { isFetching }

    let index = props.initialIndex
    let poll
    let inFixedSubtree = false

    const rootClasses = computed(
      () =>
        'q-infinite-scroll' +
        (props.reverse ? ' q-infinite-scroll--reverse' : '') +
        (suppressAnchoring.value ? ' q-infinite-scroll--no-anchoring' : '')
    )

    // the scroll target is resolved before the observer first runs (both
    // happen on mount, in this order), so that it observes with the
    // right root from the start
    onMounted(() => {
      setDebounce(props.debounce)
      resolveScrollTarget()
    })

    // A sentinel marks the end of the content the loads extend, and the
    // observer reports when it comes within `offset` of the scroll
    // target's visible area (the target is the observer's root, so the
    // margin grows its own box; the page's margin grows the viewport). No
    // scroll listener: nothing runs while the user scrolls through the
    // content, and no scroll position gets read, which makes the check
    // immune to a scroll lock pinning the page (the content sits where it
    // sat).
    const { isIntersecting, refresh } = useIntersection(() => {
      const target = scrollTargetRef.value

      return {
        target: sentinelRef,
        // a scroll target outside the component's ancestry cannot clip
        // it, so the viewport decides then
        root:
          target !== null && target !== window && target.contains(rootRef.value)
            ? target
            : null,
        rootMargin: props.reverse
          ? `${props.offset}px 0px 0px 0px`
          : `0px 0px ${props.offset}px 0px`,
        disabled: props.disable || !isWorking.value,
        onIntersect
      }
    })

    function onIntersect(entry) {
      if (entry.isIntersecting) {
        poll()
      }
    }

    function immediatePoll() {
      if (
        props.disable ||
        isFetching.value ||
        !isWorking.value ||
        !isIntersecting.value
      ) {
        return
      }

      if (scrollTargetRef.value === window) {
        // The page cannot scroll content rendered inside a position:fixed
        // subtree (a Dialog, a fullscreen overlay), so the end of the
        // content stays where it is whatever gets loaded, and each load
        // would bring the next. Such a placement needs an explicit
        // scroll-target on the overlay's own scrollable element; until it
        // gets one, loading stays off (trigger() still works). The
        // placement may have changed since it was measured (the ancestor
        // lost its fixed positioning), so re-check while dormant to come
        // back without requiring an updateScrollTarget() call.
        if (inFixedSubtree) {
          inFixedSubtree = isInFixedSubtree(rootRef.value)
        }

        // A Dialog or an overlay Drawer scroll-locks the page. The content
        // does not move under the lock, but on iOS the lock pins the body,
        // and a page pinned that way cannot be scrolled: reverse mode could
        // not compensate for the content it prepends, so the end of it
        // would stay in view and each done() would load again. Wait for
        // the release instead (the prevent-scroll release listener below).
        if (inFixedSubtree || document.qScrollPrevented === true) {
          return
        }
      }

      trigger()
    }

    function trigger() {
      if (props.disable || isFetching.value || !isWorking.value) {
        return
      }

      const target = scrollTargetRef.value

      index++
      isFetching.value = true

      // In reverse mode we compensate for the prepended content ourselves, by
      // pushing the scroll position down by however much taller the content
      // got. The browser's CSS scroll anchoring does the very same thing, so
      // while a load is in flight we opt out of it -- otherwise both fire and
      // the list jumps by a whole batch. We only suppress it for the duration
      // of the load, so that anchoring keeps protecting the reading position
      // against everything else (a late-loading image, a webfont swap...).
      if (props.reverse === true) {
        suppressAnchoring.value = true
      }

      const heightBefore = getScrollHeight(target)

      emit('load', index, isDone => {
        if (isWorking.value) {
          isFetching.value = false
          nextTick(() => {
            if (props.reverse) {
              const heightAfter = getScrollHeight(target),
                scrollPosition = getVerticalScrollPosition(target),
                heightDifference = heightAfter - heightBefore

              setVerticalScrollPosition(
                target,
                scrollPosition + heightDifference
              )
            }

            suppressAnchoring.value = false

            if (isDone === true) {
              stop()
            } else {
              // the loaded content may not have pushed the sentinel out of
              // reach, in which case the observer has nothing new to report
              refresh()
            }
          })
        }
      })
    }

    function reset() {
      index = 0
    }

    function resume() {
      if (isWorking.value) {
        refresh()
      } else {
        // observing starts again with a report of the current state
        isWorking.value = true
      }
    }

    function stop() {
      if (isWorking.value) {
        isWorking.value = false
        isFetching.value = false
        // a load that never calls done() must not leave anchoring off forever
        suppressAnchoring.value = false
        poll.cancel?.()
      }
    }

    function resolveScrollTarget() {
      const target = getScrollTarget(rootRef.value, props.scrollTarget)
      const wasInFixedSubtree = inFixedSubtree

      scrollTargetRef.value = target
      inFixedSubtree = target === window && isInFixedSubtree(rootRef.value)

      if (inFixedSubtree && !wasInFixedSubtree) {
        console.warn(
          '[Quasar] QInfiniteScroll: the window scroll target cannot react' +
            ' to content inside a position:fixed subtree (e.g. a Dialog), so' +
            ' automatic loading stays off here; set the scroll-target prop' +
            ' to a scrollable element of the overlay'
        )
      }

      // reverse mode starts scrolled to the bottom; from a fixed overlay
      // that would scroll the page behind it instead
      if (isWorking.value && props.reverse && !inFixedSubtree) {
        setVerticalScrollPosition(
          target,
          getScrollHeight(target) - height(target)
        )
      }
    }

    function updateScrollTarget() {
      resolveScrollTarget()
      refresh()
    }

    function setIndex(newIndex) {
      index = newIndex
    }

    function setDebounce(val) {
      val = Number.parseInt(val, 10)

      poll?.cancel?.()
      poll =
        val <= 0
          ? immediatePoll
          : debounce(immediatePoll, Number.isNaN(val) ? 100 : val)
    }

    const renderLoadingSlot = computed(() => !props.disable && isWorking.value)

    watch(
      () => props.disable,
      val => {
        if (val) stop()
        else resume()
      }
    )

    watch(() => props.scrollTarget, updateScrollTarget)
    watch(() => props.debounce, setDebounce)

    let scrollPos = false

    onActivated(() => {
      if (scrollPos !== false && scrollTargetRef.value !== null) {
        setVerticalScrollPosition(scrollTargetRef.value, scrollPos)
      }
    })

    onDeactivated(() => {
      scrollPos =
        scrollTargetRef.value !== null
          ? getVerticalScrollPosition(scrollTargetRef.value)
          : false
    })

    onBeforeUnmount(() => {
      poll?.cancel?.()
    })

    if (!__QUASAR_SSR_SERVER__) {
      // the lock releases without a scroll event when the page never
      // moved, so the poll skipped while locked has to be re-run here
      const onScrollLockRelease = () => {
        if (scrollTargetRef.value === window) {
          refresh()
        }
      }

      addPreventScrollReleaseListener(onScrollLockRelease)

      onBeforeUnmount(() => {
        removePreventScrollReleaseListener(onScrollLockRelease)
      })
    }

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, {
      poll: () => {
        refresh()
      },
      trigger,
      stop,
      reset,
      resume,
      setIndex,
      updateScrollTarget
    })

    return () => {
      const child = hUniqueSlot(slots.default, [])
      const sentinel = h('div', {
        ref: sentinelRef,
        class: 'q-infinite-scroll__sentinel'
      })

      if (renderLoadingSlot.value) {
        child[props.reverse ? 'unshift' : 'push'](
          h(InfiniteScrollLoading, { store }, { default: slots.loading })
        )
      }

      child[props.reverse ? 'unshift' : 'push'](sentinel)

      return h(
        'div',
        {
          class: rootClasses.value,
          ref: rootRef
        },
        child
      )
    }
  }
})
