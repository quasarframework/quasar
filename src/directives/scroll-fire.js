import { debounce } from '../utils/debounce'
import { viewport, height, offset } from '../utils/dom'
import { add, get, remove } from '../utils/store'
import { getScrollTarget } from '../utils/scroll'

function updateBinding (el, binding, ctx) {
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

    add('scrollfire', el, ctx)
  },
  inserted (el, binding) {
    let ctx = get('scrollfire', el)
    ctx.scrollTarget = getScrollTarget(el)
    updateBinding(el, binding, ctx)
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding(el, binding, get('scrollfire', el))
    }
  },
  unbind (el) {
    let ctx = get('scrollfire', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    remove('scrollfire', el)
  }
}
