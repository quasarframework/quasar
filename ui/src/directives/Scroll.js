import { getScrollTarget, getVerticalScrollPosition, getHorizontalScrollPosition } from '../utils/scroll.js'
import { listenOpts } from '../utils/event.js'

function update (ctx, { value, oldValue }) {
  if (typeof value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
    return
  }

  ctx.handler = value
  if (typeof oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll, listenOpts.passive)
  }
}

function destroy (el) {
  const ctx = el.__qscroll
  if (ctx !== void 0) {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
    delete el.__qscroll
  }
}

export default {
  name: 'scroll',

  inserted (el, binding) {
    if (el.__qscroll !== void 0) {
      destroy(el)
      el.__qscroll_destroyed = true
    }

    const ctx = {
      scrollTarget: getScrollTarget(el),
      scroll () {
        ctx.handler(
          getVerticalScrollPosition(ctx.scrollTarget),
          getHorizontalScrollPosition(ctx.scrollTarget)
        )
      }
    }

    update(ctx, binding)

    el.__qscroll = ctx
  },

  update (el, binding) {
    if (el.__qscroll !== void 0 && binding.oldValue !== binding.value) {
      update(el.__qscroll, binding)
    }
  },

  unbind (el) {
    if (el.__qscroll_destroyed === void 0) {
      destroy(el)
    }
    else {
      delete el.__qscroll_destroyed
    }
  }
}
