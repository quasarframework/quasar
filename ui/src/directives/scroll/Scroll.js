import { createDirective } from '../../utils/private.create/create.js'
import {
  getHorizontalScrollPosition,
  getScrollTarget,
  getVerticalScrollPosition
} from '../../utils/scroll/scroll.js'
import { listenOpts } from '../../utils/event/event.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

// one listener per scroll target: the target keeps the set of subscribed
// elements, each element keeps its handler and its target
function onScroll(evt) {
  const target = evt.currentTarget
  const top = getVerticalScrollPosition(target)
  const left = getHorizontalScrollPosition(target)

  for (const el of target.__qscrollSubs) {
    el.__qscroll(top, left)
  }
}

function update(el, value) {
  const target = el.__qscrollTarget

  if (typeof value === 'function') {
    if (el.__qscroll === void 0) {
      const subs = target.__qscrollSubs

      if (subs === void 0) {
        target.__qscrollSubs = new Set([el])
        target.addEventListener('scroll', onScroll, listenOpts.passive)
      } else {
        subs.add(el)
      }
    }

    el.__qscroll = value
  } else if (el.__qscroll !== void 0) {
    const subs = target.__qscrollSubs

    el.__qscroll = void 0
    subs.delete(el)

    if (subs.size === 0) {
      target.__qscrollSubs = void 0
      target.removeEventListener('scroll', onScroll, listenOpts.passive)
    }
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'scroll', getSSRProps }
    : {
        name: 'scroll',

        mounted(el, binding) {
          el.__qscrollTarget = getScrollTarget(el)
          el.__qscroll = void 0
          update(el, binding.value)
        },

        updated(el, binding) {
          if (
            el.__qscrollTarget !== void 0 &&
            binding.oldValue !== binding.value
          ) {
            update(el, binding.value)
          }
        },

        beforeUnmount(el) {
          if (el.__qscrollTarget !== void 0) {
            update(el, void 0)
            el.__qscrollTarget = void 0
          }
        }
      }
)
