import { onBeforeUnmount } from 'vue'

/**
 * Composable that encapsulates invoking user defined method on swipe, setting timeout for reset, and resetting
 * of the <a href="https://quasar.dev/vue-components/slide-item">Slide Item</a>
 * to the initial state by the timer.
 * @param fn - method that should be invoked when item is swiped
 * @param ms - time in milliseconds until the Slide Item will reset to initial state
 * @return invokable method, that should be passed to the swipe event of the list item.
 * This method accepts ({resetFn, param}), where:<br>
 *    resetFn - is the method that passed from the event;<br>
 *    param - parameter of any type that you want to pass
 * @example
 * <script setup>
 *  import { useSlideItemSwipe } from 'quasar'
 *  function doSomething(param?) {
 *     console.log(`Wow! You just swiped left and passed value: ${param}`)
 *     // will print out to console: "Wow! You just swiped left and passed value: 1234"
 *  }
 *  const onLeft = useSlideItemSwipe(doSomething, 300)
 * <script>
 * <template>
 *    <q-slide-item @left="onLeft({ resetFn: $event.reset, param: 1234 })">List Item</q-slide-item>
 * </template>
 */
export default function (fn, ms) {
  let timer = null

  function removeTimeout () {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function finalize (resetFn) {
    timer = setTimeout(() => {
      if (resetFn) resetFn()
    }, ms)
  }

  onBeforeUnmount(() => {
    removeTimeout()
  })

  return ({ resetFn, param }) => {
    fn(param)
    finalize(resetFn)
  }
}
