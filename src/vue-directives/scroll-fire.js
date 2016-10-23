import Utils from '../utils'

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
  bind (el, binding) {
    let ctx = {
      scroll: Utils.debounce(() => {
        let containerBottom, elementBottom, fire

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom
          fire = elementBottom < Utils.dom.viewport().height
        }
        else {
          containerBottom = Utils.dom.offset(ctx.scrollTarget).top + Utils.dom.height(ctx.scrollTarget)
          elementBottom = Utils.dom.offset(el).top + Utils.dom.height(el)
          fire = elementBottom < containerBottom
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
          ctx.handler(el)
        }
      }, 25)
    }

    Utils.store.add('scrollfire', el, ctx)
  },
  inserted (el, binding) {
    let ctx = Utils.store.get('scrollfire', el)
    ctx.scrollTarget = Utils.dom.getScrollTarget(el)
    updateBinding(el, binding, ctx)
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding(el, binding, Utils.store.get('scrollfire', el))
    }
  },
  unbind (el) {
    let ctx = Utils.store.get('scrollfire', el)
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll)
    Utils.store.remove('scrollfire', el)
  }
}
