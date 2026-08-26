import { onDeactivated } from 'vue'

import useTimeout from '../use-timeout/use-timeout.js'

/*
 * Usage (needs the component to have useTransitionProps):
 *    registerTransitionEnd(fn)
 *      -- runs fn once, after props.transitionDuration
 *    registerTimeout(fn[, delay]) / removeTimeout()
 *      -- the underlying useTimeout(); it is ONE shared timer slot, so
 *         registering either kind cancels whatever is pending
 */

export default function useTransitionEnd(props) {
  const { registerTimeout, removeTimeout } = useTimeout()

  let finishTransition = null

  // The tail of a show/hide transition (portal teardown, the 'show'/
  // 'hide' event) runs on a timer that useTimeout cancels when a
  // <keep-alive> page holding the component gets deactivated. Keep the
  // finisher at hand so deactivation can run it right away, or else
  // the portal is left in the DOM and the model can get stuck (#18201).
  onDeactivated(() => {
    finishTransition?.()
  })

  return {
    registerTimeout,
    removeTimeout,

    registerTransitionEnd(fn) {
      finishTransition = () => {
        finishTransition = null
        fn()
      }

      registerTimeout(finishTransition, props.transitionDuration)
    }
  }
}
