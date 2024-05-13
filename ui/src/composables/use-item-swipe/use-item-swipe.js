import { onBeforeUnmount } from 'vue'

/**
 * Composable that encapsulates the reset of the <a href="https://quasar.dev/vue-components/slide-item">Slide Item</a>
 * swipe action by the preset time elapsed.
 * @param fn - method that should be invoked when item is swiped
 * @param ms - time in milliseconds until the Slide Item will reset to initial state
 * @return invokable method, that should be passed to the swipe event of the list item.
 * This method accepts ({reset, param}), where:
 *    reset - is the method that passed from the event;
 *    param - parameter of any type that you want to pass
 * @example
 * <script setup>
 *  import { useListItemSwipe } from 'quasar'
 *  function doSomething(param?) {
 *     console.log(`Wow! You just swiped left and passed value: ${param}`)
 *     // will print out to console: "Wow! You just swiped left and passed value: 1234"
 *  }
 *  const onLeft = useListItemSwipe(doSomething, 300)
 * <script>
 * <template>
 *    <q-slide-item @left="onLeft({ reset: $event.reset, param: 1234 })">List Item</q-slide-item>
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

  return ({resetFn, param}) => {
    fn(param)
    finalize(resetFn)
  }
}
