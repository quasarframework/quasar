import {
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  shallowReactive,
  shallowRef,
  watch
} from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { height } from '../../utils/dom/dom.js'
import frameDebounce from '../../utils/frame-debounce/frame-debounce.js'
import { getScrollTarget, scrollTargetProp } from '../../utils/scroll/scroll.js'
import {
  addScrollTracking,
  removeScrollTracking
} from '../../utils/private.scroll-tracking/scroll-tracking.js'
import { hSlot } from '../../utils/private.render/render.js'
import { listenOpts } from '../../utils/event/event.js'

const { passive } = listenOpts
const mediaEvents = ['load', 'loadstart', 'loadedmetadata']

function isScrollContainer(el) {
  // a non-visible overflow-x forces overflow-y to auto, so one axis tells
  const { overflowY } = getComputedStyle(el)
  return overflowY !== 'visible' && overflowY !== 'clip'
}

/**
 * Whether the media can ride a view timeline (the browser then moves it
 * on its own thread, in step with the scroll, whatever the main thread
 * is doing) instead of the JS scroll tracking. The timeline progresses
 * against the nearest ancestor scroll container, while the JS
 * percentage is computed against the auto detected (or designated)
 * scroll target: the two agree only when nothing scrollable (an
 * overflow: hidden wrapper counts) sits in between, otherwise the
 * browser would bind the media to a box that never scrolls and freeze it.
 */
function canUseViewTimeline(el, scrollTarget) {
  if (typeof ViewTimeline === 'undefined') return false

  const stopAt = scrollTarget === window ? document.body : scrollTarget

  for (
    let node = el.parentElement;
    node !== null && node !== stopAt;
    node = node.parentElement
  ) {
    if (isScrollContainer(node)) return false
  }

  return stopAt === document.body || isScrollContainer(stopAt)
}

export default /*#__PURE__*/ createComponent({
  name: 'QParallax',

  props: {
    src: String,
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator: v => v >= 0 && v <= 1
    },

    scrollTarget: scrollTargetProp,

    onScroll: Function
  },

  setup(props, { slots, emit }) {
    const contentSlotScope = shallowReactive({ percentScrolled: 0 })
    const rootRef = shallowRef(null)
    const mediaParentRef = shallowRef(null)
    const mediaRef = shallowRef(null)

    let isWorking = false,
      isIntersecting = false,
      hasContentSlot = false,
      mediaEl,
      mediaHeight,
      resizeHandler,
      observer,
      localScrollTarget,
      // the view timeline driven movement (see canUseViewTimeline); the
      // JS tracking then only serves the consumers of the scroll
      // percentage (the "scroll" event and the "content" slot)
      animation = null

    watch(
      () => props.height,
      () => {
        syncKeyframes()
        if (isWorking) updatePos()
      }
    )

    watch(() => props.speed, syncKeyframes)
    watch(() => props.scrollTarget, refresh)
    watch(() => props.onScroll, syncTracking)

    // runs once per frame (frame debounced on mount) while the parallax
    // is on screen: the scroll percentage of the root through the scroll
    // target's box, from its top edge entering at the bottom (0) to its
    // bottom edge leaving at the top (1); the timeline, when there is
    // one, already holds it as its progress (the same number, past both
    // ends included, at a fraction of the cost of the rects), so it is
    // only measured for the JS tracking
    let updatePos = () => {
      let percent = animation?.timeline.currentTime?.value

      if (percent !== void 0) {
        percent /= 100
      } else {
        let containerBottom, containerHeight

        if (localScrollTarget === window) {
          containerBottom = containerHeight = window.innerHeight
        } else {
          const rect = localScrollTarget.getBoundingClientRect()
          containerBottom = rect.bottom
          containerHeight = rect.height
        }

        percent =
          (containerBottom - rootRef.value.getBoundingClientRect().top) /
          (props.height + containerHeight)
      }

      if (animation === null) {
        // the media keeps its compositor layer through will-change, so
        // this write never repaints it
        mediaEl.style.transform = `translate(-50%,${(mediaHeight - props.height) * percent * props.speed}px)`
      }

      contentSlotScope.percentScrolled = percent
      if (props.onScroll !== void 0) emit('scroll', percent)
    }

    // the same movement the JS tracking writes, expressed once as
    // keyframes over the root's view timeline
    function getKeyframes() {
      return [
        { transform: 'translate(-50%,0)' },
        {
          transform: `translate(-50%,${(mediaHeight - props.height) * props.speed}px)`
        }
      ]
    }

    function syncKeyframes() {
      if (animation !== null) animation.effect.setKeyframes(getKeyframes())
    }

    function onResize() {
      mediaHeight =
        mediaEl.naturalHeight || mediaEl.videoHeight || height(mediaEl)

      syncKeyframes()
      if (isWorking) updatePos()
    }

    function onAnyScroll(evt) {
      // updatePos() measures fresh viewport rects, so a scroll in ANY
      // ancestor container moves the parallax, not just one in the
      // designated one (which only defines the box the percentage is
      // computed against); a scroll inside the parallax's own content
      // never moves it, and the iOS visual viewport events carry a
      // non-node target
      if (
        !(evt.target instanceof Node) ||
        !rootRef.value.contains(evt.target)
      ) {
        updatePos()
      }
    }

    function applyEngine() {
      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)

      if (canUseViewTimeline(rootRef.value, localScrollTarget)) {
        if (animation === null) {
          mediaEl.style.transform = ''
          animation = mediaEl.animate(getKeyframes(), {
            timeline: new ViewTimeline({
              subject: rootRef.value,
              axis: 'block'
            }),
            fill: 'both'
          })
        }
      } else if (animation !== null) {
        animation.cancel()
        animation = null
      }
    }

    // re-decides everything settled at mount: the scroll target and the
    // engine that fits it, the media size and the position; for changes
    // the component cannot observe on its own (an ancestor's overflow,
    // a media swap without a load event, a scroll-target appearing later)
    function refresh() {
      stopTracking()
      applyEngine()
      onResize()
      syncTracking()
    }

    function needsTracking() {
      return animation === null || props.onScroll !== void 0 || hasContentSlot
    }

    function onIntersection(entries) {
      isIntersecting = entries[0].isIntersecting

      if (isIntersecting && needsTracking()) {
        startTracking()
      } else {
        stopTracking()
      }
    }

    // the observer is only created once something needs the tracking,
    // so a timeline driven parallax without consumers costs no JS at all
    function syncTracking() {
      if (!needsTracking()) {
        stopTracking()
      } else if (observer === void 0) {
        observer = new IntersectionObserver(onIntersection)
        observer.observe(rootRef.value)
      } else if (isIntersecting) {
        startTracking()
      }
    }

    function startTracking() {
      if (isWorking) return

      isWorking = true
      addScrollTracking(onAnyScroll)
      window.addEventListener('resize', resizeHandler, passive)
      updatePos()
    }

    function stopTracking() {
      if (isWorking) {
        isWorking = false
        removeScrollTracking(onAnyScroll)
        window.removeEventListener('resize', resizeHandler, passive)
        updatePos.cancel()
        resizeHandler.cancel()
      }
    }

    onMounted(() => {
      updatePos = frameDebounce(updatePos)
      resizeHandler = frameDebounce(onResize)

      mediaEl =
        slots.media !== void 0
          ? mediaParentRef.value.children[0]
          : mediaRef.value

      mediaEvents.forEach(evtName => {
        mediaEl.addEventListener(evtName, onResize)
      })

      // shown before the first measurement, so a media without a natural
      // size yet (image still loading, video before its metadata)
      // measures its rendered box, as every later onResize() does
      mediaEl.style.display = 'initial'
      onResize()
      applyEngine()
      hasContentSlot = slots.content !== void 0
      syncTracking()
    })

    // a conditional "content" slot can come and go after mount, and with
    // it the need for the tracking that feeds its percentage
    onUpdated(() => {
      const has = slots.content !== void 0
      if (has !== hasContentSlot) {
        hasContentSlot = has
        syncTracking()
      }
    })

    // expose public method
    getCurrentInstance().proxy.refresh = refresh

    onBeforeUnmount(() => {
      stopTracking()
      animation?.cancel()
      observer?.disconnect()
      mediaEvents.forEach(evtName => {
        mediaEl.removeEventListener(evtName, onResize)
      })
    })

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: 'q-parallax',
          style: { height: `${props.height}px` }
        },
        [
          h(
            'div',
            {
              ref: mediaParentRef,
              class: 'q-parallax__media absolute-full'
            },
            slots.media !== void 0
              ? slots.media()
              : [
                  h('img', {
                    ref: mediaRef,
                    src: props.src
                  })
                ]
          ),

          h(
            'div',
            { class: 'q-parallax__content absolute-full column flex-center' },
            slots.content !== void 0
              ? slots.content(contentSlotScope)
              : hSlot(slots.default)
          )
        ]
      )
  }
})
