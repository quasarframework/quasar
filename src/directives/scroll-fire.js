import { debounce } from '../utils/debounce'
import { viewport, height, offset } from '../utils/dom'
import { getScrollTarget } from '../utils/scroll'

function updateBinding (el, binding) {
  const ctx = el.__qscrollfire

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    console.error('v-scroll-fire requires a function as parameter', el)
    return
  }

  ctx.handler = binding.value
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll)
    ctx.scroll()
  }
}

export default {
  name: 'scroll-fire',
  bind (el, binding) {
    let ctx = {
      scroll: debounce(() => {
        let containerBottom, elementBottom, fire

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom
          fire = elementBottom < viewport().height
        }
        else {
          containerBottom = offset(ctx.scrollTarget).top + height(ctx.scrollTarget)
          elementBottom = offset(el).top + height(el)
          fire = elementBottom < containerBottom
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
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
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    delete el.__qscrollfire
  }
}
