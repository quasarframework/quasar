import * as store from '../utils/store'

function updateBinding (el, selector) {
  const
    ctx = store.get('move', el),
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
  bind (el, { value }) {
    store.add('move', el, {})
  },
  update (el, { oldValue, value }) {
    if (oldValue !== value) {
      const ctx = store.get('move', el)
      ctx.target = document.querySelector(value)
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
    store.remove('move', el)
  }
}
