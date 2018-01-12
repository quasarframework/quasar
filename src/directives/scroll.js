import { getScrollPosition, getScrollTarget } from '../utils/scroll'

function updateBinding (el, binding) {
  const ctx = el.__qscroll

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
    el.__qscroll = ctx
  },
  inserted (el, binding) {
    let ctx = el.__qscroll
    ctx.scrollTarget = getScrollTarget(el)
    updateBinding(el, binding)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding)
    }
  },
  unbind (el) {
    let ctx = el.__qscroll
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    delete el.__qscroll
  }
}
