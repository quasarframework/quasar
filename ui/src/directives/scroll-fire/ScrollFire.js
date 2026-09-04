import { createDirective } from '../../utils/private.create/create.js'
import {
  observe,
  unobserve
} from '../../utils/private.intersection/intersection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function getThreshold(arg) {
  return arg === void 0 ? 0 : Math.min(1, Math.max(0, Number(arg) || 0))
}

// shared by every element: the entry carries the element and the
// element carries its subscriber
function onEntry(entry) {
  const el = entry.target
  const sub = el.__qintersection

  if (entry.isIntersecting && entry.intersectionRatio >= sub.threshold) {
    sub.fn(el)
    return false
  }
}

function update(el, sub, { value, oldValue, arg }) {
  if (typeof value !== 'function') {
    unobserve(el)
    return
  }

  sub.fn = value
  sub.threshold = getThreshold(arg)

  // a fired element re-arms only when it was disabled in between
  if (typeof oldValue !== 'function') {
    sub.done = false
  }

  observe(el, sub, null, '0px', sub.threshold)
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'scroll-fire', getSSRProps }
    : {
        name: 'scroll-fire',

        mounted(el, binding) {
          const sub = {
            handler: onEntry,
            once: false,
            pool: void 0,
            done: false,
            fn: void 0,
            threshold: 0
          }

          el.__qscrollfire = sub
          update(el, sub, binding)
        },

        updated(el, binding) {
          const sub = el.__qscrollfire

          if (
            sub !== void 0 &&
            (binding.value !== binding.oldValue ||
              sub.threshold !== getThreshold(binding.arg))
          ) {
            update(el, sub, binding)
          }
        },

        beforeUnmount(el) {
          unobserve(el)
          el.__qscrollfire = void 0
        }
      }
)
