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
  watch
} from 'vue'

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
import { listenOpts } from '../../utils/event/event.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'

const { passive } = listenOpts

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
    const loadingRef = ref(null)

    let index = props.initialIndex
    let localScrollTarget, poll

    const classes = computed(
      () =>
        'q-infinite-scroll__loading' + (isFetching.value ? '' : ' invisible')
    )

    const rootClasses = computed(
      () =>
        'q-infinite-scroll' +
        (suppressAnchoring.value ? ' q-infinite-scroll--no-anchoring' : '')
    )

    function immediatePoll() {
      if (props.disable || isFetching.value || !isWorking.value) {
        return
      }

      // A Dialog or an overlay Drawer scroll-locks the page (body becomes
      // position:fixed), which pins the window scroll position at 0. Reverse
      // mode reads that as "scrolled to the top", so each done() would
      // trigger the next load for as long as the overlay stays open. Skip
      // polling while locked: polling resumes on release, through the
      // restore's scroll event or, when the page sat at top so no event can
      // fire, through the prevent-scroll release listeners. Element scroll
      // targets keep their own geometry under the lock, so they stay live.
      if (localScrollTarget === window && document.qScrollPrevented === true) {
        return
      }

      const scrollHeight = getScrollHeight(localScrollTarget),
        scrollPosition = getVerticalScrollPosition(localScrollTarget),
        containerHeight = height(localScrollTarget)

      if (!props.reverse) {
        if (
          Math.round(scrollPosition + containerHeight + props.offset) >=
          Math.round(scrollHeight)
        ) {
          trigger()
        }
      } else if (Math.round(scrollPosition) <= props.offset) {
        trigger()
      }
    }

    function trigger() {
      if (props.disable || isFetching.value || !isWorking.value) {
        return
      }

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

      const heightBefore = getScrollHeight(localScrollTarget)

      emit('load', index, isDone => {
        if (isWorking.value) {
          isFetching.value = false
          nextTick(() => {
            if (props.reverse) {
              const heightAfter = getScrollHeight(localScrollTarget),
                scrollPosition = getVerticalScrollPosition(localScrollTarget),
                heightDifference = heightAfter - heightBefore

              setVerticalScrollPosition(
                localScrollTarget,
                scrollPosition + heightDifference
              )
            }

            suppressAnchoring.value = false

            if (isDone === true) {
              stop()
            } else if (rootRef.value?.closest('body')) {
              poll()
            }
          })
        }
      })
    }

    function reset() {
      index = 0
    }

    function resume() {
      if (!isWorking.value) {
        isWorking.value = true
        localScrollTarget.addEventListener('scroll', poll, passive)
      }

      immediatePoll()
    }

    function stop() {
      if (isWorking.value) {
        isWorking.value = false
        isFetching.value = false
        // a load that never calls done() must not leave anchoring off forever
        suppressAnchoring.value = false
        localScrollTarget.removeEventListener('scroll', poll, passive)
        poll?.cancel?.()
      }
    }

    function updateScrollTarget() {
      if (localScrollTarget && isWorking.value) {
        localScrollTarget.removeEventListener('scroll', poll, passive)
      }

      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)

      if (isWorking.value) {
        localScrollTarget.addEventListener('scroll', poll, passive)

        if (props.reverse) {
          const scrollHeight = getScrollHeight(localScrollTarget),
            containerHeight = height(localScrollTarget)

          setVerticalScrollPosition(
            localScrollTarget,
            scrollHeight - containerHeight
          )
        }

        immediatePoll()
      }
    }

    function setIndex(newIndex) {
      index = newIndex
    }

    function setDebounce(val) {
      val = Number.parseInt(val, 10)

      const oldPoll = poll

      poll =
        val <= 0
          ? immediatePoll
          : debounce(immediatePoll, Number.isNaN(val) ? 100 : val)

      if (localScrollTarget && isWorking.value) {
        if (oldPoll !== void 0) {
          localScrollTarget.removeEventListener('scroll', oldPoll, passive)
        }

        localScrollTarget.addEventListener('scroll', poll, passive)
      }
    }

    function updateSvgAnimations(isRetry) {
      if (renderLoadingSlot.value) {
        if (loadingRef.value === null) {
          if (!isRetry) {
            nextTick(() => {
              updateSvgAnimations(true)
            })
          }
          return
        }

        // we need to pause svg animations (if any) when hiding
        // otherwise the browser will keep on recalculating the style
        const action = `${isFetching.value ? 'un' : ''}pauseAnimations`
        ;[...loadingRef.value.getElementsByTagName('svg')].forEach(el => {
          el[action]()
        })
      }
    }

    const renderLoadingSlot = computed(() => !props.disable && isWorking.value)

    watch([isFetching, renderLoadingSlot], () => {
      updateSvgAnimations()
    })

    watch(
      () => props.disable,
      val => {
        if (val) stop()
        else resume()
      }
    )

    watch(
      () => props.reverse,
      () => {
        if (!isFetching.value && isWorking.value) {
          immediatePoll()
        }
      }
    )

    watch(() => props.scrollTarget, updateScrollTarget)
    watch(() => props.debounce, setDebounce)

    let scrollPos = false

    onActivated(() => {
      if (scrollPos !== false && localScrollTarget) {
        setVerticalScrollPosition(localScrollTarget, scrollPos)
      }
    })

    onDeactivated(() => {
      scrollPos = localScrollTarget
        ? getVerticalScrollPosition(localScrollTarget)
        : false
    })

    onBeforeUnmount(() => {
      if (isWorking.value) {
        localScrollTarget.removeEventListener('scroll', poll, passive)
      }
    })

    if (!__QUASAR_SSR_SERVER__) {
      // when a scroll lock releases with the page already at the saved
      // position no scroll event fires, so the poll skipped while locked
      // (see immediatePoll) has to be re-run through this channel
      const onScrollLockRelease = () => {
        if (localScrollTarget === window) {
          immediatePoll()
        }
      }

      addPreventScrollReleaseListener(onScrollLockRelease)

      onBeforeUnmount(() => {
        removePreventScrollReleaseListener(onScrollLockRelease)
      })
    }

    onMounted(() => {
      setDebounce(props.debounce)
      updateScrollTarget()

      if (!isFetching.value) updateSvgAnimations()
    })

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, {
      poll: () => {
        poll?.()
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

      if (renderLoadingSlot.value) {
        child[props.reverse ? 'unshift' : 'push'](
          h(
            'div',
            { ref: loadingRef, class: classes.value },
            hSlot(slots.loading)
          )
        )
      }

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
