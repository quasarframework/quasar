import { getCurrentInstance, onBeforeUnmount, onMounted, watch } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import {
  getHorizontalScrollPosition,
  getScrollTarget,
  getVerticalScrollPosition,
  scrollTargetProp
} from '../../utils/scroll/scroll.js'
import { listenOpts, noop } from '../../utils/event/event.js'

const { passive } = listenOpts
const axisValues = ['both', 'horizontal', 'vertical']

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/scroll-observer
 */
export default createComponent({
  name: 'QScrollObserver',

  props: {
    /**
     * Axis on which to detect changes
     *
     * @api prop axis
     * @type {String}
     * @default 'vertical'
     * @category behavior
     * @value 'both'
     * @value 'vertical'
     * @value 'horizontal'
     */
    axis: {
      type: String,
      validator: v => axisValues.includes(v),
      default: 'vertical'
    },

    /**
     * Debounce amount (in milliseconds)
     *
     * @api prop debounce
     * @type {String|Number}
     * @category behavior
     * @example 0
     * @example '530'
     */
    debounce: [String, Number],

    /**
     * CSS selector or DOM element to be used as a custom scroll container instead of the auto detected one
     *
     * @api prop scroll-target
     * @extends scroll-target
     */
    scrollTarget: scrollTargetProp
  },

  emits: [
    /**
     * Emitted when scroll position changes
     *
     * @api event scroll
     * @param {Object} details Scroll details
     */
    'scroll'
  ],

  setup(props, { emit }) {
    const scroll = {
      position: {
        top: 0,
        left: 0
      },

      direction: 'down',
      directionChanged: false,

      delta: {
        top: 0,
        left: 0
      },

      inflectionPoint: {
        top: 0,
        left: 0
      }
    }

    let clearTimer = null,
      localScrollTarget,
      parentEl

    watch(
      () => props.scrollTarget,
      () => {
        unconfigureScrollTarget()
        configureScrollTarget()
      }
    )

    function emitEvent() {
      clearTimer?.()

      const top = Math.max(0, getVerticalScrollPosition(localScrollTarget))
      const left = getHorizontalScrollPosition(localScrollTarget)

      const delta = {
        top: top - scroll.position.top,
        left: left - scroll.position.left
      }

      if (
        (props.axis === 'vertical' && delta.top === 0) ||
        (props.axis === 'horizontal' && delta.left === 0)
      ) {
        return
      }

      const curDir =
        Math.abs(delta.top) >= Math.abs(delta.left)
          ? delta.top < 0
            ? 'up'
            : 'down'
          : delta.left < 0
            ? 'left'
            : 'right'

      scroll.position = { top, left }
      scroll.directionChanged = scroll.direction !== curDir
      scroll.delta = delta

      if (scroll.directionChanged) {
        scroll.direction = curDir
        scroll.inflectionPoint = scroll.position
      }

      emit('scroll', { ...scroll })
    }

    function configureScrollTarget() {
      localScrollTarget = getScrollTarget(parentEl, props.scrollTarget)
      localScrollTarget.addEventListener('scroll', trigger, passive)
      trigger(true)
    }

    function unconfigureScrollTarget() {
      if (localScrollTarget !== void 0) {
        localScrollTarget.removeEventListener('scroll', trigger, passive)
        localScrollTarget = void 0
      }
    }

    /**
     * Emit a 'scroll' event
     *
     * @api method trigger
     * @param {Boolean} immediately Skip over the debounce amount
     * @returns {void}
     */
    function trigger(immediately) {
      if (
        immediately === true ||
        props.debounce === 0 ||
        props.debounce === '0'
      ) {
        emitEvent()
      } else if (clearTimer === null) {
        const [timer, fn] = props.debounce
          ? [setTimeout(emitEvent, props.debounce), clearTimeout]
          : [requestAnimationFrame(emitEvent), cancelAnimationFrame]

        clearTimer = () => {
          fn(timer)
          clearTimer = null
        }
      }
    }

    const { proxy } = getCurrentInstance()

    watch(() => proxy.$q.lang.rtl, emitEvent)

    onMounted(() => {
      parentEl = proxy.$el.parentNode
      configureScrollTarget()
    })

    onBeforeUnmount(() => {
      clearTimer?.()
      unconfigureScrollTarget()
    })

    // expose public methods
    Object.assign(proxy, {
      trigger,

      /**
       * Get current scroll details under the form of an Object: { position, direction, directionChanged, inflectionPoint }
       *
       * @api method getPosition
       * @returns {Object}
       */
      getPosition: () => scroll
    })

    return noop
  }
})
