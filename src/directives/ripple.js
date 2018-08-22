import { cssTransform, css } from '../utils/dom.js'
import { position } from '../utils/event.js'

function showRipple (evt, el, { stop, center }) {
  if (stop) {
    evt.stopPropagation()
  }

  const
    container = document.createElement('span'),
    animNode = document.createElement('span'),
    size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight,
    unit = `${center ? size : size * 2}px`,
    offset = el.getBoundingClientRect()

  container.appendChild(animNode)
  container.className = 'q-ripple-container'
  animNode.className = 'q-ripple-animation'
  animNode.style.width = unit
  animNode.style.height = unit

  el.appendChild(container)

  let x, y

  if (center) {
    x = y = 0
  }
  else {
    const pos = position(evt)
    x = pos.left - offset.left - size
    y = pos.top - offset.top - size
  }

  animNode.classList.add('q-ripple-animation-enter')
  animNode.classList.add('q-ripple-animation-visible')
  css(animNode, cssTransform(`translate(${x}px, ${y}px) scale3d(0, 0, 0)`))

  setTimeout(() => {
    animNode.classList.remove('q-ripple-animation-enter')
    css(animNode, cssTransform(`translate(${x}px, ${y}px) scale3d(1, 1, 1)`))
    setTimeout(() => {
      animNode.classList.remove('q-ripple-animation-visible')
      setTimeout(() => { container.remove() }, 300)
    }, 300)
  }, 10)
}

function shouldAbort ({ mat, ios }) {
  return (
    (mat && process.env.THEME !== 'mat') ||
    (ios && process.env.THEME !== 'ios')
  )
}

export default {
  name: 'ripple',
  inserted (el, { value, modifiers }) {
    if (shouldAbort(modifiers)) {
      return
    }

    const ctx = {
      enabled: value !== false,
      modifiers: {
        stop: modifiers.stop,
        center: modifiers.center
      },
      click (evt) {
        if (ctx.enabled && evt.detail !== -1) {
          showRipple(evt, el, ctx.modifiers)
        }
      },
      keyup (evt) {
        if (ctx.enabled && evt.keyCode === 13) {
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
  unbind (el, { modifiers }) {
    const ctx = el.__qripple
    if (ctx && !shouldAbort(modifiers)) {
      el.removeEventListener('click', ctx.click, false)
      el.removeEventListener('keyup', ctx.keyup, false)
      delete el.__qripple
    }
  }
}
