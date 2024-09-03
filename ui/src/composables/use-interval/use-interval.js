import { onDeactivated, onBeforeUnmount, getCurrentInstance } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'

/*
 * Usage:
 *    registerInterval(fn[, delay])
 *    removeInterval()
 */

export default function () {
  let timer = null
  const vm = getCurrentInstance()

  function removeInterval () {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  onDeactivated(removeInterval)
  onBeforeUnmount(removeInterval)

  return {
    removeInterval,

    registerInterval (fn, delay) {
      removeInterval(timer)

      if (vmIsDestroyed(vm) === false) {
        timer = setInterval(fn, delay)
      }
    }
  }
}
