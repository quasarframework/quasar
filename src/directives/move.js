import { add, get, remove } from '../utils/store'

function updateBinding (el, selector) {
  const
    ctx = get('move', el),
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
    add('move', el, {})
  },
  update (el, { oldValue, value }) {
    if (oldValue !== value) {
      const ctx = get('move', el)
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
    remove('move', el)
  }
}
