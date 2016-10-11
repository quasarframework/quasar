let data = {}

export default {
  bind (el, binding) {
    let ctx = {}

    if (binding.modifiers.wrap) {
      ctx.target = document.createElement('div')

      el.parentNode.insertBefore(ctx.target, el)
      ctx.target.appendChild(el)
    }
    else {
      ctx.target = el
    }

    ctx.target.classList.add('quasar-tooltip')

    if (binding.modifiers.inline) {
      ctx.target.classList.add('flex', 'inline')
    }

    ctx.target.setAttribute('quasar-tooltip', binding.value)
    data[el] = ctx
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      data[el].target.setAttribute('quasar-tooltip', binding.value)
    }
  }
}
