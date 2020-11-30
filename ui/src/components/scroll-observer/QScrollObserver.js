import { defineComponent, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

import { getScrollPosition, getScrollTarget, getHorizontalScrollPosition } from '../../utils/scroll.js'
import { listenOpts, noop } from '../../utils/event.js'

const { passive } = listenOpts

export default defineComponent({
  name: 'QScrollObserver',

  props: {
    debounce: [ String, Number ],
    horizontal: Boolean,

    scrollTarget: {
      default: void 0
    }
  },

  emits: ['scroll'],

  setup (props, { emit }) {
    const instance = getCurrentInstance()

    let position = 0
    let direction = props.horizontal === true ? 'right' : 'down'
    let directionChanged = false
    let inflexionPosition = 0

    let timer, localScrollTarget, parentEl

    watch(() => props.scrollTarget, () => {
      unconfigureScrollTarget()
      configureScrollTarget()
    })

    function getPosition () {
      return {
        position,
        direction,
        directionChanged,
        inflexionPosition
      }
    }

    function emitEvent () {
      const fn = props.horizontal === true
        ? getHorizontalScrollPosition
        : getScrollPosition

      const
        curPos = Math.max(0, fn(localScrollTarget)),
        delta = curPos - position,
        curDir = props.horizontal === true
          ? delta < 0 ? 'left' : 'right'
          : delta < 0 ? 'up' : 'down'

      directionChanged = direction !== curDir

      if (directionChanged === true) {
        direction = curDir
        inflexionPosition = position
      }

      timer = null
      position = curPos
      emit('scroll', getPosition())
    }

    function configureScrollTarget () {
      localScrollTarget = getScrollTarget(parentEl, props.scrollTarget)
      localScrollTarget.addEventListener('scroll', trigger, passive)
      trigger(true)
    }

    function unconfigureScrollTarget () {
      if (localScrollTarget !== void 0) {
        localScrollTarget.removeEventListener('scroll', trigger, passive)
        localScrollTarget = void 0
      }
    }

    function trigger (immediately) {
      if (immediately === true || props.debounce === 0 || props.debounce === '0') {
        emitEvent()
      }
      else if (!timer) {
        timer = props.debounce
          ? setTimeout(emitEvent, props.debounce)
          : requestAnimationFrame(emitEvent)
      }
    }

    onMounted(() => {
      parentEl = instance.proxy.$el.parentNode
      configureScrollTarget()
    })

    onBeforeUnmount(() => {
      clearTimeout(timer)
      cancelAnimationFrame(timer)
      unconfigureScrollTarget()
    })

    // expose public methods
    Object.assign(instance.proxy, { trigger, getPosition })

    return noop
  }
})
