import { getCurrentInstance, onBeforeUnmount, onDeactivated } from 'vue'

import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    registerAnimationFrame(fn)
 *    removeAnimationFrame()
 */

export default function useAnimationFrame() {
  if (__QUASAR_SSR_SERVER__) {
    return {
      removeAnimationFrame: noop,
      registerAnimationFrame: noop
    }
  }

  let frameId = null
  const vm = getCurrentInstance()

  function removeAnimationFrame() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }
  }

  if (vm !== null) {
    onDeactivated(removeAnimationFrame)
    onBeforeUnmount(removeAnimationFrame)
  }

  return {
    removeAnimationFrame,

    registerAnimationFrame(fn) {
      removeAnimationFrame()

      if (vm === null || !vmIsDestroyed(vm)) {
        frameId = requestAnimationFrame(() => {
          frameId = null
          fn()
        })
      }
    }
  }
}
