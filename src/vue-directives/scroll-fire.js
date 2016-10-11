import Utils from '../utils'

let data = {}

function updateBinding (el, ctx, binding) {
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
      scrollTarget: Utils.dom.getScrollTarget(el),
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

    data[el] = ctx
    updateBinding(el, ctx, binding)
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding(el, data[el], binding)
    }
  },
  unbind (el) {
    data[el].scrollTarget.removeEventListener('scroll', data[el].scroll)
    delete data[el]
  }
}
