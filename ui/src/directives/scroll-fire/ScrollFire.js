import { createDirective } from '../../utils/private.create/create.js'
import debounce from '../../utils/debounce/debounce.js'
import { height, offset } from '../../utils/dom/dom.js'
import { getScrollTarget } from '../../utils/scroll/scroll.js'
import { listenOpts } from '../../utils/event/event.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const { passive } = listenOpts

function update (ctx, { value, oldValue }) {
  if (typeof value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, passive)
    return
  }

  ctx.handler = value
  if (typeof oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll, passive)
    ctx.scroll()
  }
}

export default createDirective(__QUASAR_SSR_SERVER__
  ? { name: 'scroll-fire', getSSRProps }
  : {
      name: 'scroll-fire',

      mounted (el, binding) {
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
              ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, passive)
              ctx.handler(el)
            }
          }, 25)
        }

        update(ctx, binding)

        el.__qscrollfire = ctx
      },

      updated (el, binding) {
        if (binding.value !== binding.oldValue) {
          update(el.__qscrollfire, binding)
        }
      },

      beforeUnmount (el) {
        const ctx = el.__qscrollfire
        ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, passive)
        ctx.scroll.cancel()
        delete el.__qscrollfire
      }
    }
)
