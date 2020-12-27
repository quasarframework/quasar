import debounce from '../utils/debounce.js'
import { height, offset } from '../utils/dom.js'
import { getScrollTarget } from '../utils/scroll.js'
import { listenOpts } from '../utils/event.js'

function update (ctx, { value, oldValue }) {
  if (typeof value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
    return
  }

  ctx.handler = value
  if (typeof oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll, listenOpts.passive)
    ctx.scroll()
  }
}

function destroy (el) {
  const ctx = el.__qscrollfire
  if (ctx !== void 0) {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
    delete el.__qscrollfire
  }
}

export default {
  name: 'scroll-fire',

  inserted (el, binding) {
    if (el.__qscrollfire !== void 0) {
      destroy(el)
      el.__qscrollfire_destroyed = true
    }

    const ctx = {
      scrollTarget: getScrollTarget(el),
      scroll: debounce(() => {
        let containerBottom, elBottom

        if (ctx.scrollTarget === window) {
          elBottom = el.getBoundingClientRect().bottom
          containerBottom = window.innerHeight
        }
        else {
          elBottom = offset(el).top + height(el)
          containerBottom = offset(ctx.scrollTarget).top + height(ctx.scrollTarget)
        }

        if (elBottom > 0 && elBottom < containerBottom) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
          ctx.handler(el)
        }
      }, 25)
    }

    update(ctx, binding)

    el.__qscrollfire = ctx
  },

  update (el, binding) {
    if (el.__qscrollfire !== void 0 && binding.value !== binding.oldValue) {
      update(el.__qscrollfire, binding)
    }
  },

  unbind (el) {
    if (el.__qscrollfire_destroyed === void 0) {
      destroy(el)
    }
    else {
      delete el.__qscrollfire_destroyed
    }
  }
}
