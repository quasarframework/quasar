import { nextTick, onBeforeUnmount } from 'vue'

/*
 * Usage:
 *    registerTick(fn)
 *    registerTick(fn)
 */

export default function () {
  let tickFn

  onBeforeUnmount(() => {
    tickFn = void 0
  })

  return {
    registerTick (fn) {
      tickFn = fn

      nextTick(() => {
        if (tickFn === fn) {
          tickFn()
          tickFn = void 0
        }
      })
    },

    removeTick () {
      tickFn = void 0
    }
  }
}
