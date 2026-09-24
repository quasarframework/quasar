import { getCurrentInstance, nextTick, onMounted, shallowRef } from 'vue'

import useElementResize from '../../composables/use-element-resize/use-element-resize.js'
import useTimeout from '../../composables/use-timeout/use-timeout.js'

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

    const { proxy } = getCurrentInstance()
    const target = shallowRef(null)

    const { refresh } = useElementResize(() => ({
      target,
      debounce: props.debounce,
      onResize(size) {
        emit('resize', size)
      }
    }))

    const { registerTimeout, isTimeoutPending } = useTimeout()

    // expose public method
    proxy.trigger = immediately => {
      if (
        immediately === true ||
        props.debounce === 0 ||
        props.debounce === '0'
      ) {
        refresh()
      } else if (!isTimeoutPending.value) {
        registerTimeout(refresh, props.debounce)
      }
    }

    // the observed element is the parent, which only
    // exists once this (comment) node is in the DOM
    const init = stop => {
      target.value = proxy.$el.parentNode

      if (target.value === null && !stop) {
        nextTick(() => {
          init(true)
        })
      }
    }

    onMounted(() => {
      init()
    })

    return noop
  }
})
