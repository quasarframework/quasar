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
import { listenOpts } from '../../utils/event/event.js'
import { hSlot, hUniqueSlot } from '../../utils/private.render/render.js'

const { passive } = listenOpts

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/infinite-scroll
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */

/**
 * Slot displaying something while loading content; Example: QSpinner
 *
 * @api slot loading
 */
export default createComponent({
  name: 'QInfiniteScroll',

  props: {
    /**
     * Offset (pixels) to bottom of Infinite Scroll container from which the component should start loading more content in advance
     *
     * @api prop offset
     * @type {Number}
     * @default 500
     * @category behavior
     */
    offset: {
      type: Number,
      default: 500
    },

    /**
     * Debounce amount (in milliseconds)
     *
     * @api prop debounce
     * @type {String|Number}
     * @default 100
     * @category behavior
     */
    debounce: {
      type: [String, Number],
      default: 100
    },

    /**
     * @api prop scroll-target
     * @extends scroll-target
     */
    scrollTarget: scrollTargetProp,

    /**
     * Initialize the pagination index (used for the @load event)
     *
     * @api prop initial-index
     * @type {Number}
     * @default 0
     * @category behavior
     */
    initialIndex: {
      type: Number,
      default: 0
    },

    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean,
    /**
     * Scroll area should behave like a messenger - starting scrolled to bottom and loading when reaching the top
     *
     * @api prop reverse
     * @type {Boolean}
     * @category behavior
     */
    reverse: Boolean
  },

  emits: ['load'],

  setup(props, { slots, emit }) {
    const isFetching = ref(false)
    const isWorking = ref(true)
    const rootRef = ref(null)
    const loadingRef = ref(null)

    let index = props.initialIndex
    let localScrollTarget, poll

    const classes = computed(
      () =>
        'q-infinite-scroll__loading' + (isFetching.value ? '' : ' invisible')
    )

    function immediatePoll() {
      if (props.disable || isFetching.value || !isWorking.value) {
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

    /**
     * Tells Infinite Scroll to load more content, regardless of the scroll position
     *
     * @api method trigger
     */
    function trigger() {
      if (props.disable || isFetching.value || !isWorking.value) {
        return
      }

      index++
      isFetching.value = true

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

            if (isDone === true) {
              stop()
            } else if (rootRef.value?.closest('body')) {
              /**
               * Checks scroll position and loads more content if necessary
               *
               * @api method poll
               */
              poll()
            }
          })
        }
      })
    }

    /**
     * Resets calling index to 0
     *
     * @api method reset
     */
    function reset() {
      index = 0
    }

    /**
     * Starts working. Checks scroll position upon call and if trigger is hit, it loads more content
     *
     * @api method resume
     */
    function resume() {
      if (!isWorking.value) {
        isWorking.value = true
        localScrollTarget.addEventListener('scroll', poll, passive)
      }

      immediatePoll()
    }

    /**
     * Stops working, regardless of scroll position
     *
     * @api method stop
     */
    function stop() {
      if (isWorking.value) {
        isWorking.value = false
        isFetching.value = false
        localScrollTarget.removeEventListener('scroll', poll, passive)
        poll?.cancel?.()
      }
    }

    /**
     * Updates the scroll target; Useful when the parent elements change so that the scrolling target also changes
     *
     * @api method updateScrollTarget
     */
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

    /**
     * Overwrite the current pagination index
     *
     * @api method setIndex
     * @param {Number} newIndex New pagination index
     */
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
          class: 'q-infinite-scroll',
          ref: rootRef
        },
        child
      )
    }
  }
})
