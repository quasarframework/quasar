import Utils from '../utils'

let data = {}

function updateBinding (el, ctx, binding) {
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
    data[el] = {
      scrollTarget: Utils.dom.getScrollTarget(el),
      scroll () {
        data[el].handler(Utils.dom.getScrollPosition(data[el].scrollTarget))
      }
    }
    updateBinding(el, data[el], binding)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, data[el], binding)
    }
  },
  unbind (el) {
    data[el].scrollTarget.removeEventListener('scroll', data[el].scroll)
    delete data[el]
  }
}
