import { add, get, remove } from '../utils/store'
import { getScrollPosition, getScrollTarget } from '../utils/scroll'

function updateBinding (el, binding, ctx) {
  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    console.error('v-scroll requires a function as parameter', el)
    return
  }

  ctx.handler = binding.value
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll)
  }
}

export default {
  name: 'scroll',
  bind (el, binding) {
    let ctx = {
      scroll () {
        ctx.handler(getScrollPosition(ctx.scrollTarget))
      }
    }
    add('scroll', el, ctx)
  },
  inserted (el, binding) {
    let ctx = get('scroll', el)
    ctx.scrollTarget = getScrollTarget(el)
    updateBinding(el, binding, ctx)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding, get('scroll', el))
    }
  },
  unbind (el) {
    let ctx = get('scroll', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    remove('scroll', el)
  }
}
