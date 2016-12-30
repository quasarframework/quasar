import Utils from '../utils'

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
  bind (el, binding) {
    let ctx = {
      scroll () {
        ctx.handler(Utils.dom.getScrollPosition(ctx.scrollTarget))
      }
    }
    Utils.store.add('scroll', el, ctx)
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scroll', el)
    ctx.scrollTarget = Utils.dom.getScrollTarget(el)
    updateBinding(el, binding, ctx)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding, Utils.store.get('scroll', el))
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scroll', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    Utils.store.remove('scroll', el)
  }
}
