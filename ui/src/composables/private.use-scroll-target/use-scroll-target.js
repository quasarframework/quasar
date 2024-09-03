import { ref, watch, onBeforeUnmount } from 'vue'

import { listenOpts } from '../../utils/event/event.js'

export default function (props, configureScrollTarget) {
  const localScrollTarget = ref(null)
  let scrollFn

  function changeScrollEvent (scrollTarget, fn) {
    const fnProp = `${ fn !== void 0 ? 'add' : 'remove' }EventListener`
    const fnHandler = fn !== void 0 ? fn : scrollFn

    if (scrollTarget !== window) {
      scrollTarget[ fnProp ]('scroll', fnHandler, listenOpts.passive)
    }

    window[ fnProp ]('scroll', fnHandler, listenOpts.passive)

    scrollFn = fn
  }

  function unconfigureScrollTarget () {
    if (localScrollTarget.value !== null) {
      changeScrollEvent(localScrollTarget.value)
      localScrollTarget.value = null
    }
  }

  const noParentEventWatcher = watch(() => props.noParentEvent, () => {
    if (localScrollTarget.value !== null) {
      unconfigureScrollTarget()
      configureScrollTarget()
    }
  })

  onBeforeUnmount(noParentEventWatcher)

  return {
    localScrollTarget,
    unconfigureScrollTarget,
    changeScrollEvent
  }
}
