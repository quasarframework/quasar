import { createDirective } from '../utils/private/create.js'
import { getScrollTarget, getVerticalScrollPosition, getHorizontalScrollPosition } from '../utils/scroll.js'
import { listenOpts } from '../utils/event.js'
import getSSRProps from '../utils/private/noop-ssr-directive-transform.js'

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

export default createDirective(__QUASAR_SSR_SERVER__
  ? { name: 'scroll', getSSRProps }
  : {
      name: 'scroll',

      mounted (el, binding) {
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

      updated (el, binding) {
        if (el.__qscroll !== void 0 && binding.oldValue !== binding.value) {
          update(el.__qscroll, binding)
        }
      },

      beforeUnmount (el) {
        const ctx = el.__qscroll
        ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
        delete el.__qscroll
      }
    }
)
