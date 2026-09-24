import {
  ReactiveEffect,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  toValue
} from 'vue'

import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const { stop } = useEventListener(target, event, handler, options)
 *
 * target  - ref (or getter) of an EventTarget (Element, window, document,
 *           ...) or of a component instance (its root element); a nullish
 *           value means there is nothing to listen to (yet)
 * event   - event name, or an Array of names (ref or getter accepted)
 * handler - called with the Event
 * options - plain object, ref or getter of:
 *    capture, passive, once - addEventListener() options
 *    disabled               - pause listening
 */

// Text and Comment nodes are EventTargets too, but nothing dispatches on
// them; a component with a fragment root resolves to one of those
function getEventTarget(target) {
  const value = toValue(target)

  if (value === null || value === void 0) return null

  const node = value.$el ?? value

  return typeof node.addEventListener === 'function' &&
    node.nodeType !== 3 &&
    node.nodeType !== 8
    ? node
    : null
}

export default function useEventListener(target, event, handler, options) {
  if (__QUASAR_SSR_SERVER__) {
    return { stop: noop }
  }

  const vm = getCurrentInstance()

  let node = null,
    events = [],
    listenOpts = null,
    key = null

  function release() {
    if (node !== null) {
      events.forEach(name => {
        node.removeEventListener(name, handler, listenOpts)
      })

      node = null
      events = []
      listenOpts = null
      key = null
    }
  }

  // a raw effect with a sync scheduler costs a fraction of watch();
  // it tracks whatever the target, the event and the options read
  const effect = new ReactiveEffect(() => {
    const newNode = getEventTarget(target)
    const names = toValue(event)
    const opts = toValue(options) ?? {}

    const newEvents = (Array.isArray(names) ? names : [names]).filter(
      name => typeof name === 'string' && name !== ''
    )
    const capture = opts.capture === true
    // left out when unset, so the browser's own default applies (touch
    // and wheel listeners on window/document are passive by default)
    const passive = typeof opts.passive === 'boolean' ? opts.passive : void 0
    const once = opts.once === true
    const newKey = `${newEvents.join(' ')}|${capture}|${passive}|${once}`

    if (opts.disabled === true || newNode === null || newEvents.length === 0) {
      release()
      return
    }

    if (newNode === node && newKey === key) return

    release()

    node = newNode
    events = newEvents
    listenOpts = { capture, passive, once }
    key = newKey

    events.forEach(name => {
      node.addEventListener(name, handler, listenOpts)
    })
  })

  effect.scheduler = () => {
    effect.run()
  }

  if (vm !== null) {
    // first run once the template refs and the root element exist
    onMounted(() => {
      effect.run()
    })
    onBeforeUnmount(release)
  } else {
    effect.run()
  }

  return {
    stop() {
      release()
      effect.stop()
    }
  }
}
