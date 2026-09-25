import { getCurrentInstance, onMounted, shallowRef } from 'vue'

import useAnimationFrame from '../../composables/use-animation-frame/use-animation-frame.js'
import useScroll from '../../composables/use-scroll/use-scroll.js'
import useTimeout from '../../composables/use-timeout/use-timeout.js'

import { createComponent } from '../../utils/private.create/create.js'
import { scrollTargetProp } from '../../utils/scroll/scroll.js'
import { noop } from '../../utils/event/event.js'

const axisValues = ['both', 'horizontal', 'vertical']

export default /*#__PURE__*/ createComponent({
  name: 'QScrollObserver',

  props: {
    axis: {
      type: String,
      validator: v => axisValues.includes(v),
      default: 'vertical'
    },

    debounce: [String, Number],

    scrollTarget: scrollTargetProp
  },

  emits: ['scroll'],

  setup(props, { emit }) {
    if (__QUASAR_SSR_SERVER__) return noop

    const { proxy } = getCurrentInstance()
    const target = shallowRef(null)

    const {
      scrollPosition,
      scrollDirection,
      scrollDirectionChanged,
      scrollDelta,
      scrollInflectionPoint,
      refreshScroll
    } = useScroll(() => ({
      target,
      scrollTarget: props.scrollTarget,
      axis: props.axis,
      debounce: props.debounce,
      onScroll(details) {
        emit('scroll', details)
      }
    }))

    const { registerAnimationFrame } = useAnimationFrame()
    const { registerTimeout, isTimeoutPending } = useTimeout()

    // expose public methods
    Object.assign(proxy, {
      trigger(immediately) {
        if (
          immediately === true ||
          props.debounce === 0 ||
          props.debounce === '0'
        ) {
          refreshScroll()
        } else if (props.debounce === void 0) {
          registerAnimationFrame(refreshScroll)
        } else if (!isTimeoutPending.value) {
          registerTimeout(refreshScroll, props.debounce)
        }
      },

      getPosition: () => ({
        position: scrollPosition.value,
        direction: scrollDirection.value,
        directionChanged: scrollDirectionChanged.value,
        delta: scrollDelta.value,
        inflectionPoint: scrollInflectionPoint.value
      })
    })

    // the scroll container is detected from the parent, which only
    // exists once this (comment) node is in the DOM
    onMounted(() => {
      target.value = proxy.$el.parentNode
    })

    return noop
  }
})
