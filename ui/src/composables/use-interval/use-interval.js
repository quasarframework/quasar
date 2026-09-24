import { getCurrentInstance, onBeforeUnmount, onDeactivated, ref } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    registerInterval(fn[, delay])
 *    removeInterval()
 *    isIntervalActive - Ref<boolean>
 */

export default function useInterval() {
  const isIntervalActive = ref(false)

  if (__QUASAR_SSR_SERVER__) {
    return {
      isIntervalActive,
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
      isIntervalActive.value = false
    }
  }

  onDeactivated(removeInterval)
  onBeforeUnmount(removeInterval)

  return {
    isIntervalActive,
    removeInterval,

    registerInterval(fn, delay) {
      if (vmIsDestroyed(vm)) return

      removeInterval()
      isIntervalActive.value = true
      timer = setInterval(fn, delay)
    }
  }
}
