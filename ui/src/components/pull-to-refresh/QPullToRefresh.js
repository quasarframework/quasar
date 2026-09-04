import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  withDirectives
} from 'vue'

import PullToRefreshPuller from './PullToRefreshPuller.js'
import TouchPan from '../../directives/touch-pan/TouchPan.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useIntersection from '../../composables/use-intersection/use-intersection.js'

import { createComponent } from '../../utils/private.create/create.js'
import {
  getScrollTarget,
  getVerticalScrollPosition,
  scrollTargetProp
} from '../../utils/scroll/scroll.js'
import { between } from '../../utils/format/format.js'
import { prevent } from '../../utils/event/event.js'
import { hSlot } from '../../utils/private.render/render.js'

const PULLER_HEIGHT = 40,
  OFFSET_TOP = 20

export default /*#__PURE__*/ createComponent({
  name: 'QPullToRefresh',

  props: {
    color: String,
    bgColor: String,
    icon: String,
    noMouse: Boolean,
    disable: Boolean,

    scrollTarget: scrollTargetProp
  },

  emits: ['refresh'],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const state = ref('pull')
    const pullRatio = ref(0)
    const pulling = ref(false)
    const pullPosition = ref(-PULLER_HEIGHT)
    const animating = ref(false)
    const positionCSS = ref({})

    const store = { state, pullRatio, pullPosition, animating, positionCSS }

    // A pull can only start while the start of the content is on screen,
    // so TouchPan stays disarmed (no touchmove listener, which would block
    // the scroll on its first move) whenever it is not. The observer is
    // only a pre-filter: the sentinel is visible for as long as the
    // component's edge is, which is not the same as the scroll target
    // sitting at its end (content above the component in the same
    // scroller, the layout header over the page's top padding...), so
    // the exact decision is still the scroll position read at pull start.
    const sentinelRef = ref(null)
    const { isIntersecting: contentEdgeVisible } = useIntersection({
      target: sentinelRef
    })

    function pull(event) {
      if (event.isFinal) {
        if (pulling.value) {
          pulling.value = false

          if (state.value === 'pulled') {
            state.value = 'refreshing'
            animateTo({ pos: OFFSET_TOP })
            trigger()
          } else if (state.value === 'pull') {
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }
        }

        return
      }

      if (animating.value || state.value === 'refreshing') {
        return false
      }

      if (event.isFirst) {
        if (
          getVerticalScrollPosition(localScrollTarget) !== 0 ||
          event.direction !== 'down'
        ) {
          if (pulling.value) {
            pulling.value = false
            state.value = 'pull'
            animateTo({ pos: -PULLER_HEIGHT, ratio: 0 })
          }

          return false
        }

        pulling.value = true

        const { top, left } = proxy.$el.getBoundingClientRect()
        positionCSS.value = {
          top: top + 'px',
          left: left + 'px',
          width: window.getComputedStyle(proxy.$el).getPropertyValue('width')
        }
      }

      prevent(event.evt)

      const distance = Math.min(140, Math.max(0, event.distance.y))
      pullPosition.value = distance - PULLER_HEIGHT
      pullRatio.value = between(distance / (OFFSET_TOP + PULLER_HEIGHT), 0, 1)

      const newState = pullPosition.value > OFFSET_TOP ? 'pulled' : 'pull'

      if (state.value !== newState) {
        state.value = newState
      }
    }

    const directives = computed(() => {
      const modifiers = { down: true }

      if (!props.noMouse) {
        modifiers.mouse = true
      }

      // TouchPan only acquires gestures while its value is a function, so
      // disabling happens in place; detaching the directive would re-create
      // the whole content (#12668-class)
      return [
        [
          TouchPan,
          props.disable || !contentEdgeVisible.value ? void 0 : pull,
          void 0,
          modifiers
        ]
      ]
    })

    const contentClass = computed(
      () =>
        `q-pull-to-refresh__content${pulling.value ? ' no-pointer-events' : ''}`
    )

    function trigger() {
      emit('refresh', () => {
        animateTo({ pos: -PULLER_HEIGHT, ratio: 0 }, () => {
          state.value = 'pull'
        })
      })
    }

    let localScrollTarget,
      timer = null

    function animateTo({ pos, ratio }, done) {
      animating.value = true
      pullPosition.value = pos

      if (ratio !== void 0) {
        pullRatio.value = ratio
      }

      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        animating.value = false
        done?.()
      }, 300)
    }

    function updateScrollTarget() {
      localScrollTarget = getScrollTarget(proxy.$el, props.scrollTarget)
    }

    watch(() => props.scrollTarget, updateScrollTarget)

    onMounted(updateScrollTarget)

    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
    })

    // expose public methods
    Object.assign(proxy, { trigger, updateScrollTarget })

    return () =>
      withDirectives(
        h('div', { class: 'q-pull-to-refresh' }, [
          h('div', { ref: sentinelRef, class: 'q-pull-to-refresh__sentinel' }),

          h('div', { class: contentClass.value }, hSlot(slots.default)),

          h(PullToRefreshPuller, {
            store,
            color: props.color,
            bgColor: props.bgColor,
            icon: props.icon || $q.iconSet.pullToRefresh.icon
          })
        ]),
        directives.value
      )
  }
})
