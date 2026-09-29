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
import useQuasar from '../../composables/use-quasar/use-quasar.js'

import { createComponent } from '../../utils/private.create/create.js'
import debounce from '../../utils/debounce/debounce.js'
import { height, width } from '../../utils/dom/dom.js'
import {
  getHorizontalScrollPosition,
  getScrollHeight,
  getScrollTarget,
  getScrollWidth,
  getVerticalScrollPosition,
  scrollTargetProp,
  setHorizontalScrollPosition,
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
    reverse: Boolean,
    horizontal: Boolean
  },

  emits: ['load'],

  setup(props, { slots, emit }) {
    const $q = useQuasar()

    const isFetching = ref(false)
    const isWorking = ref(true)
    const suppressAnchoring = ref(false)
    const rootRef = shallowRef(null)
    const sentinelRef = shallowRef(null)
    const scrollTargetRef = shallowRef(null)

    const store = { isFetching }

    let index = props.initialIndex
    let poll
    let inFixedSubtree = false

    const rootClasses = computed(
      () =>
        'q-infinite-scroll' +
        (props.horizontal ? ' q-infinite-scroll--horizontal' : '') +
        (props.reverse ? ' q-infinite-scroll--reverse' : '') +
        (suppressAnchoring.value ? ' q-infinite-scroll--no-anchoring' : '')
    )

    // the sentinel sits along the edge the loads extend, at the end of
    // the content (the start of it in reverse mode); the edge is logical
    // in horizontal mode, so that the sentinel follows the direction of
    // the text (RTL flips it) without any class change
    const sentinelClass = computed(
      () =>
        'q-infinite-scroll__sentinel q-infinite-scroll__sentinel--' +
        (props.horizontal
          ? props.reverse
            ? 'start'
            : 'end'
          : props.reverse
            ? 'top'
            : 'bottom')
    )

    // the physical side of the visible area that loading reaches out of
    // (an observer's rootMargin, like a client rect, knows no direction)
    const loadingSide = computed(() => {
      if (!props.horizontal) {
        return props.reverse ? 'top' : 'bottom'
      }

      const start = $q.lang.rtl === true ? 'right' : 'left'
      const end = $q.lang.rtl === true ? 'left' : 'right'

      return props.reverse ? start : end
    })

    // scroll size, position and visible size along the loading axis; the
    // horizontal position is read and set as a distance from the start
    // edge, since an RTL scroller counts its scroll position from its
    // right edge (negative values going left)
    function getScrollSize(target) {
      return props.horizontal ? getScrollWidth(target) : getScrollHeight(target)
    }

    function getScrollPosition(target) {
      return props.horizontal
        ? Math.abs(getHorizontalScrollPosition(target))
        : getVerticalScrollPosition(target)
    }

    function setScrollPosition(target, position) {
      if (props.horizontal) {
        setHorizontalScrollPosition(
          target,
          $q.lang.rtl === true ? -position : position
        )
      } else {
        setVerticalScrollPosition(target, position)
      }
    }

    function getVisibleSize(target) {
      return props.horizontal ? width(target) : height(target)
    }

    // the scroll target is resolved before the observer first runs (both
    // happen on mount, in this order), so that it observes with the
    // right root from the start
    onMounted(() => {
      setDebounce(props.debounce)
      resolveScrollTarget()

      // The observer's opening report cannot decide the first load: it
      // lands a frame later, and the app may well have grown the content
      // by then (a loading placeholder from its own onMounted, a
      // nextTick, an async component). The report then reads "out of
      // reach", and since an observer never re-reports a state that
      // merely holds, an app whose first page is fetched from `@load`
      // would wait forever for a load it never asked for. So the first
      // one is decided here instead, off the DOM as it stands at mount,
      // which is the moment the check has always been made at. Calling
      // trigger() straight, rather than through the debounced poll, also
      // keeps that first load off the clock.
      if (!props.disable && isSentinelInReach() && !isLoadingSuspended()) {
        trigger()
      }
    })

    // A sentinel marks the end of the content the loads extend, and the
    // observer reports when it comes within `offset` of the scroll
    // target's visible area (the target is the observer's root, so the
    // margin grows its own box on the loading side; the page's margin
    // grows the viewport). No scroll listener: nothing runs while the
    // user scrolls through the content, and no scroll position gets
    // read, which makes the check immune to a scroll lock pinning the
    // page (the content sits where it sat).
    const { isIntersecting, refreshIntersection } = useIntersection(() => {
      const target = scrollTargetRef.value
      const side = loadingSide.value
      const margin = ['top', 'right', 'bottom', 'left']
        .map(edge => (edge === side ? props.offset : 0) + 'px')
        .join(' ')

      return {
        target: sentinelRef,
        // a scroll target outside the component's ancestry cannot clip
        // it, so the viewport decides then
        root:
          target !== null && target !== window && target.contains(rootRef.value)
            ? target
            : null,
        rootMargin: margin,
        disabled: props.disable || !isWorking.value,
        onIntersect
      }
    })

    function onIntersect(entry) {
      if (entry.isIntersecting) {
        poll()
      }
    }

    // The reach test the observer applies, taken by hand: the sentinel
    // clipped by every scrolling ancestor below the root, against the
    // root's own box grown by `offset` on the loading side. An observer
    // has no synchronous form and the first load cannot wait for one.
    function isSentinelInReach() {
      const el = sentinelRef.value
      if (el === null) return false

      const target = scrollTargetRef.value
      const rootEl =
        target !== null && target !== window && target.contains(rootRef.value)
          ? target
          : null

      const {
        top: rootTop,
        bottom: rootBottom,
        left: rootLeft,
        right: rootRight
      } = rootEl !== null
        ? rootEl.getBoundingClientRect()
        : {
            top: 0,
            bottom: document.documentElement.clientHeight,
            left: 0,
            right: document.documentElement.clientWidth
          }

      let { top, bottom, left, right } = el.getBoundingClientRect()

      for (
        let node = el.parentElement;
        node !== null && node !== rootEl;
        node = node.parentElement
      ) {
        if (window.getComputedStyle(node).overflow === 'visible') continue

        const clip = node.getBoundingClientRect()
        if (clip.top > top) top = clip.top
        if (clip.bottom < bottom) bottom = clip.bottom
        if (clip.left > left) left = clip.left
        if (clip.right < right) right = clip.right
        if (top > bottom || left > right) return false
      }

      const side = loadingSide.value

      return (
        bottom >= rootTop - (side === 'top' ? props.offset : 0) &&
        top <= rootBottom + (side === 'bottom' ? props.offset : 0) &&
        right >= rootLeft - (side === 'left' ? props.offset : 0) &&
        left <= rootRight + (side === 'right' ? props.offset : 0)
      )
    }

    // the window-scroll-target placements a load must not fire from
    function isLoadingSuspended() {
      if (scrollTargetRef.value !== window) return false

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
      return inFixedSubtree || document.qScrollPrevented === true
    }

    function immediatePoll() {
      if (
        props.disable ||
        isFetching.value ||
        !isWorking.value ||
        !isIntersecting.value ||
        isLoadingSuspended()
      ) {
        return
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
      // pushing the scroll position on by however much larger the content
      // got. The browser's CSS scroll anchoring does the very same thing, so
      // while a load is in flight we opt out of it -- otherwise both fire and
      // the list jumps by a whole batch. We only suppress it for the duration
      // of the load, so that anchoring keeps protecting the reading position
      // against everything else (a late-loading image, a webfont swap...).
      if (props.reverse === true) {
        suppressAnchoring.value = true
      }

      const sizeBefore = getScrollSize(target)

      emit('load', index, isDone => {
        if (isWorking.value) {
          isFetching.value = false
          nextTick(() => {
            if (props.reverse) {
              setScrollPosition(
                target,
                getScrollPosition(target) + getScrollSize(target) - sizeBefore
              )
            }

            suppressAnchoring.value = false

            if (isDone === true) {
              stop()
            } else {
              // the loaded content may not have pushed the sentinel out of
              // reach, in which case the observer has nothing new to report
              refreshIntersection()
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
        refreshIntersection()
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

      // reverse mode starts scrolled to the end; from a fixed overlay
      // that would scroll the page behind it instead
      if (isWorking.value && props.reverse && !inFixedSubtree) {
        setScrollPosition(
          target,
          getScrollSize(target) - getVisibleSize(target)
        )
      }
    }

    function updateScrollTarget() {
      resolveScrollTarget()
      refreshIntersection()
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
        setScrollPosition(scrollTargetRef.value, scrollPos)
      }
    })

    onDeactivated(() => {
      scrollPos =
        scrollTargetRef.value !== null
          ? getScrollPosition(scrollTargetRef.value)
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
          refreshIntersection()
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
        refreshIntersection()
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
        class: sentinelClass.value
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
