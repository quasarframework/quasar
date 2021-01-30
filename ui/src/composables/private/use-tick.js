import { nextTick, onBeforeUnmount } from 'vue'

/*
 * Usage:
 *    registerTick(fn)
 *    registerTick(fn)
 *    ....
 *    prepareTick()
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

    prepareTick () {
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
