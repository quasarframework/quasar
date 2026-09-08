import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { noop } from '../../utils/event/event.js'

export default /*#__PURE__*/ createComponent({
  name: 'QResizeObserver',

  props: {
    debounce: {
      type: [String, Number],
      default: 100
    }
  },

  emits: ['resize'],

  setup(props, { emit }) {
    if (__QUASAR_SSR_SERVER__) return noop

    let timer = null,
      targetEl,
      size = { width: -1, height: -1 }

    function trigger(immediately) {
      if (
        immediately === true ||
        props.debounce === 0 ||
        props.debounce === '0'
      ) {
        emitEvent()
      } else if (timer === null) {
        timer = setTimeout(emitEvent, props.debounce)
      }
    }

    function emitEvent() {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      if (targetEl) {
        const { offsetWidth: width, offsetHeight: height } = targetEl

        if (width !== size.width || height !== size.height) {
          size = { width, height }
          emit('resize', size)
        }
      }
    }

    const { proxy } = getCurrentInstance()

    // expose public method
    proxy.trigger = trigger

    let observer,
      isDestroyed = false

    // initialize as soon as possible
    const init = stop => {
      if (isDestroyed) return

      targetEl = proxy.$el.parentNode

      if (targetEl) {
        observer = new ResizeObserver(trigger)
        // the emitted size is offsetWidth/offsetHeight (the border box), so
        // observe that box too: a padding or border change on the target
        // itself leaves the default content box untouched and would go
        // unnoticed until an unrelated resize
        observer.observe(targetEl, { box: 'border-box' })
        emitEvent()
      } else if (!stop) {
        nextTick(() => {
          init(true)
        })
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      isDestroyed = true
      if (timer !== null) clearTimeout(timer)
      if (observer) {
        observer.disconnect()
        observer = null
      }
    })

    return noop
  }
})
