import { getCurrentInstance, onBeforeUnmount, onDeactivated, ref } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    registerTimeout(fn[, delay])
 *    removeTimeout()
 *    isTimeoutPending - Ref<boolean>
 */

export default function useTimeout() {
  const isTimeoutPending = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      isTimeoutPending,
      removeTimeout: noop,
      registerTimeout: noop
    }
  }

  let timer = null
  const vm = getCurrentInstance()

  function removeTimeout() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
      isTimeoutPending.value = false
    }
  }

  if (vm !== null) {
    onDeactivated(removeTimeout)
    onBeforeUnmount(removeTimeout)
  }

  return {
    isTimeoutPending,
    removeTimeout,

    registerTimeout(fn, delay) {
      if (vm !== null && vmIsDestroyed(vm)) return

      removeTimeout()
      isTimeoutPending.value = true
      timer = setTimeout(() => {
        timer = null
        isTimeoutPending.value = false
        fn()
      }, delay)
    }
  }
}
