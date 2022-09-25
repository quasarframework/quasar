import { nextTick, onDeactivated, onBeforeUnmount, getCurrentInstance } from 'vue'

import { vmIsDestroyed } from '../../utils/private/vm'

/*
 * Usage:
 *    registerTick(fn)
 *    removeTick()
 */

export default function () {
  let tickFn
  const vm = getCurrentInstance()

  function removeTick () {
    tickFn = void 0
  }

  onDeactivated(removeTick)
  onBeforeUnmount(removeTick)

  return {
    removeTick,

    registerTick (fn) {
      tickFn = fn

      nextTick(() => {
        // we also check if VM is destroyed, since if it
        // got to trigger one nextTick() we cannot stop it
        if (tickFn === fn) {
          vmIsDestroyed(vm) === false && tickFn()
          tickFn = void 0
        }
      })
    }
  }
}
