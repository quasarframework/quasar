import debounce from '../utils/debounce.js'
import { height, offset } from '../utils/dom.js'
import { getScrollTarget } from '../utils/scroll.js'
import { listenOpts } from '../utils/event.js'

function updateBinding (ctx, { value, oldValue }) {
  if (typeof value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    return
  }

  ctx.handler = value
  if (typeof oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll, listenOpts.passive)
    ctx.scroll()
  }
}

export default {
  name: 'scroll-fire',

  bind (el) {
    const ctx = {
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

    if (el.__qscrollfire) {
      el.__qscrollfire_old = el.__qscrollfire
    }

    el.__qscrollfire = ctx
  },

  inserted (el, binding) {
    const ctx = el.__qscrollfire
    ctx.scrollTarget = getScrollTarget(el)
    updateBinding(ctx, binding)
  },

  update (el, binding) {
    if (el.__qscrollfire !== void 0 && binding.value !== binding.oldValue) {
      updateBinding(el.__qscrollfire, binding)
    }
  },

  unbind (el) {
    const ctx = el.__qscrollfire_old || el.__qscrollfire
    if (ctx !== void 0) {
      ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
      delete el[el.__qscrollfire_old ? '__qscrollfire_old' : '__qscrollfire']
    }
  }
}
