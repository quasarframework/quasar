import { cssTransform, css } from '../utils/dom'
import { position } from '../utils/event'

function showRipple (evt, el, stopPropagation) {
  if (stopPropagation) {
    evt.stopPropagation()
  }

  let
    container = document.createElement('span'),
    animNode = document.createElement('span'),
    size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight,
    unit = `${size * 2}px`

  container.appendChild(animNode)
  container.className = 'q-ripple-container'
  animNode.className = 'q-ripple-animation'
  animNode.style.width = unit
  animNode.style.height = unit

  el.appendChild(container)

  const
    offset = el.getBoundingClientRect(),
    pos = position(evt),
    x = pos.left - offset.left - size,
    y = pos.top - offset.top - size

  animNode.classList.add('q-ripple-animation-enter')
  animNode.classList.add('q-ripple-animation-visible')
  css(animNode, cssTransform(`translate(${x}px, ${y}px) scale3d(0, 0, 0)`))

  setTimeout(() => {
    animNode.classList.remove('q-ripple-animation-enter')
    css(animNode, cssTransform(`translate(${x}px, ${y}px) scale3d(1, 1, 1)`))
    setTimeout(() => {
      animNode.classList.remove('q-ripple-animation-visible')
      setTimeout(() => {
        if (container.parentNode) {
          el.removeChild(container)
        }
      }, 300)
    }, 300)
  }, 0)
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
      click (evt) {
        if (ctx.enabled) {
          showRipple(evt, el, modifiers.stop)
        }
      },
      keyup (evt) {
        if (ctx.enabled && evt.keyCode === 13) {
          showRipple(evt, el, modifiers.stop)
        }
      }
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
    el.addEventListener('keyup', ctx.keyup, false)
  },
  update (el, { value, oldValue }) {
    if (el.__qripple && value !== oldValue) {
      el.__qripple.enabled = value !== false
    }
  },
  unbind (el, { modifiers }) {
    const ctx = el.__qripple
    if (!ctx || shouldAbort(modifiers)) {
      return
    }

    el.removeEventListener('click', ctx.click, false)
    el.removeEventListener('keyup', ctx.keyup, false)
    delete el.__qripple
  }
}
