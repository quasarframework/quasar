import { onDeactivated, onBeforeUnmount, getCurrentInstance } from 'vue'

import { vmIsDestroyed } from '../../utils/private/vm'

/*
 * Usage:
 *    registerTimeout(fn[, delay])
 *    removeTimeout()
 */

export default function () {
  let timer
  const vm = getCurrentInstance()

  function removeTimeout () {
    clearTimeout(timer)
  }

  onDeactivated(removeTimeout)
  onBeforeUnmount(removeTimeout)

  return {
    removeTimeout,

    registerTimeout (fn, delay) {
      clearTimeout(timer)

      if (vmIsDestroyed(vm) === false) {
        timer = setTimeout(fn, delay)
      }
    }
  }
}
