import { getCurrentInstance, onBeforeUnmount, onDeactivated } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    registerInterval(fn[, delay])
 *    removeInterval()
 */

export default function useInterval() {
  if (__QUASAR_SSR_SERVER__) {
    return {
      removeInterval: noop,
      registerInterval: noop
    }
  }

  let timer = null
  const vm = getCurrentInstance()

  function removeInterval() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  onDeactivated(removeInterval)
  onBeforeUnmount(removeInterval)

  return {
    removeInterval,

    registerInterval(fn, delay) {
      removeInterval()

      if (!vmIsDestroyed(vm)) {
        timer = setInterval(fn, delay)
      }
    }
  }
}
