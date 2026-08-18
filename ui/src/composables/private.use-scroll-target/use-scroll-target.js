import { onBeforeUnmount, ref, watch } from 'vue'

import { client } from '../../plugins/platform/Platform.js'
import { listenOpts } from '../../utils/event/event.js'

export default function useScrollTarget(props, configureScrollTarget) {
  const localScrollTarget = ref(null)
  let scrollFn

  function changeScrollEvent(scrollTarget, fn) {
    const fnProp = `${fn !== void 0 ? 'add' : 'remove'}EventListener`
    const fnHandler = fn !== void 0 ? fn : scrollFn

    if (scrollTarget !== window) {
      scrollTarget[fnProp]('scroll', fnHandler, listenOpts.passive)
    }

    window[fnProp]('scroll', fnHandler, listenOpts.passive)

    if (client.is.ios && window.visualViewport !== void 0) {
      // with the soft keyboard open (or while pinch-zoomed), iOS scrolls
      // only the visual viewport: no window scroll event fires for those
      // steps, yet position:fixed popups stay pinned to the pre-scroll
      // viewport, so the handler must also run on visual viewport moves
      // for the position engine to read a settled offsetTop/offsetLeft
      window.visualViewport[fnProp]('scroll', fnHandler, listenOpts.passive)
      window.visualViewport[fnProp]('resize', fnHandler, listenOpts.passive)
    }

    scrollFn = fn
  }

  function unconfigureScrollTarget() {
    if (localScrollTarget.value !== null) {
      changeScrollEvent(localScrollTarget.value)
      localScrollTarget.value = null
    }
  }

  const noParentEventWatcher = watch(
    () => props.noParentEvent,
    () => {
      if (localScrollTarget.value !== null) {
        unconfigureScrollTarget()
        configureScrollTarget()
      }
    }
  )

  onBeforeUnmount(noParentEventWatcher)

  return {
    localScrollTarget,
    unconfigureScrollTarget,
    changeScrollEvent
  }
}
