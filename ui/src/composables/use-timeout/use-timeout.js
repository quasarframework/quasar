import { onDeactivated, onBeforeUnmount, getCurrentInstance } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'

/*
 * Usage:
 *    registerTimeout(fn[, delay])
 *    removeTimeout()
 */

export default function () {
  let timer = null
  const vm = getCurrentInstance()

  function removeTimeout () {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  onDeactivated(removeTimeout)
  onBeforeUnmount(removeTimeout)

  return {
    removeTimeout,

    registerTimeout (fn, delay) {
      removeTimeout()

      if (vmIsDestroyed(vm) === false) {
        timer = setTimeout(() => {
          timer = null
          fn()
        }, delay)
      }
    }
  }
}
