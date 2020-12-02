import { nextTick, onBeforeUnmount } from 'vue'

/*
 * Usage:
 *    registerTick(fn)
 *    registerTick(fn)
 *    ....
 *    planTick()
 */

export default function () {
  let tickFn

  onBeforeUnmount(() => {
    tickFn = void 0
  })

  return {
    registerTick (fn) {
      tickFn = fn
    },

    removeTick () {
      tickFn = void 0
    },

    planTick () {
      if (tickFn !== void 0) {
        const fn = tickFn
        nextTick(() => {
          if (tickFn === fn) {
            tickFn()
            tickFn = void 0
          }
        })
      }
    }
  }
}
