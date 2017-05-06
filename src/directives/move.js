function updateBinding (el, selector) {
  const
    ctx = el.__qmove,
    parent = el.parentNode

  if (!ctx.target) {
    ctx.target = document.querySelector(selector)
  }
  if (ctx.target) {
    if (parent !== ctx.target) {
      ctx.target.appendChild(el)
    }
  }
  else if (parent) {
    parent.removeChild(el)
  }
}

export default {
  name: 'move',
  bind (el, { value }) {
    el.__qmove = {}
  },
  update (el, { oldValue, value }) {
    if (oldValue !== value) {
      el.__qmove.target = document.querySelector(value)
    }
    updateBinding(el, value)
  },
  inserted (el, { value }) {
    updateBinding(el, value)
  },
  unbind (el) {
    const parent = el.parentNode
    if (parent) {
      parent.removeChild(el)
    }
    delete el.__qmove
  }
}
