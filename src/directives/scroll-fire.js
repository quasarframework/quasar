import { debounce } from '../utils/debounce'
import { height, offset } from '../utils/dom'
import { getScrollTarget } from '../utils/scroll'
import { listenOpts } from '../utils/event'

function updateBinding (el, binding) {
  const ctx = el.__qscrollfire

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    console.error('v-scroll-fire requires a function as parameter', el)
    return
  }

  ctx.handler = binding.value
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll, listenOpts.passive)
    ctx.scroll()
  }
}

export default {
  name: 'scroll-fire',
  bind (el, binding) {
    let ctx = {
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

    el.__qscrollfire = ctx
  },
  inserted (el, binding) {
    let ctx = el.__qscrollfire
    ctx.scrollTarget = getScrollTarget(el)
    updateBinding(el, binding)
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding(el, binding)
    }
  },
  unbind (el) {
    let ctx = el.__qscrollfire
    if (!ctx) { return }
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll, listenOpts.passive)
    delete el.__qscrollfire
  }
}
