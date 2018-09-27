import { position } from '../utils/event.js'

function showRipple (evt, el, { stop, center }) {
  if (stop) {
    evt.stopPropagation()
  }

  center = center || evt.detail <= 0 // comes from keyboard event

  const
    container = document.createElement('span'),
    animNode = document.createElement('span'),
    size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight,
    unit = `${size * 2}px`,
    offset = el.getBoundingClientRect()

  container.appendChild(animNode)
  container.className = 'q-ripple'
  animNode.className = 'q-ripple__animation'
  animNode.style.width = unit
  animNode.style.height = unit

  el.appendChild(container)

  let x, y

  if (center) {
    x = (el.clientWidth / 2) - size
    y = (el.clientHeight / 2) - size
  }
  else {
    const pos = position(evt)
    x = pos.left - offset.left - size
    y = pos.top - offset.top - size
  }

  animNode.classList.add('q-ripple__animation--enter')
  animNode.classList.add('q-ripple__animation--visible')
  animNode.style.transform = `translate(${x}px, ${y}px) scale3d(0, 0, 0)`

  setTimeout(() => {
    animNode.classList.remove('q-ripple__animation--enter')
    animNode.style.transform = `translate(${x}px, ${y}px) scale3d(1, 1, 1)`
    setTimeout(() => {
      animNode.classList.remove('q-ripple__animation--visible')
      setTimeout(() => { container.remove() }, 300)
    }, 300)
  }, 10)
}

export default {
  name: 'ripple',

  inserted (el, { value, modifiers }) {
    const ctx = {
      enabled: value !== false,
      modifiers: {
        stop: modifiers.stop,
        center: modifiers.center
      },
      click (evt) {
        if (ctx.enabled && !evt.defaultPrevented) {
          showRipple(evt, el, ctx.modifiers)
        }
      },
      keyup (evt) {
        if (ctx.enabled && !evt.defaultPrevented && evt.keyCode === 13) {
          showRipple(evt, el, ctx.modifiers)
        }
      }
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
    el.addEventListener('keyup', ctx.keyup, false)
  },

  update (el, { value, modifiers: { stop, center } }) {
    const ctx = el.__qripple
    if (ctx) {
      ctx.enabled = value !== false
      ctx.modifiers = { stop, center }
    }
  },

  unbind (el) {
    const ctx = el.__qripple
    if (ctx) {
      el.removeEventListener('click', ctx.click, false)
      el.removeEventListener('keyup', ctx.keyup, false)
      delete el.__qripple
    }
  }
}
