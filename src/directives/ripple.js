import { cssTransform, css } from '../utils/dom'
import { position } from '../utils/event'

function showRipple (evt, el, stopPropagation) {
  if (stopPropagation) {
    evt.stopPropagation()
  }

  let
    container = document.createElement('span'),
    animNode = document.createElement('span')

  container.appendChild(animNode)
  container.className = 'q-ripple-container'

  let size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight
  size = `${size * 2}px`
  animNode.className = 'q-ripple-animation'
  css(animNode, { width: size, height: size })

  el.appendChild(container)

  const
    offset = el.getBoundingClientRect(),
    pos = position(evt),
    x = pos.left - offset.left,
    y = pos.top - offset.top

  animNode.classList.add('q-ripple-animation-enter', 'q-ripple-animation-visible')
  css(animNode, cssTransform(`translate(-50%, -50%) translate(${x}px, ${y}px) scale(.001)`))

  setTimeout(() => {
    animNode.classList.remove('q-ripple-animation-enter')
    css(animNode, cssTransform(`translate(-50%, -50%) translate(${x}px, ${y}px)`))
    setTimeout(() => {
      animNode.classList.remove('q-ripple-animation-visible')
      setTimeout(() => {
        animNode.parentNode.remove()
      }, 300)
    }, 400)
  }, 25)
}

function shouldAbort ({mat, ios}) {
  return (
    (mat && __THEME__ !== 'mat') ||
    (ios && __THEME__ !== 'ios')
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
      }
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
  },
  update (el, { value, oldValue }) {
    if (el.__qripple && value !== oldValue) {
      el.__qripple.enabled = value !== false
    }
  },
  unbind (el, { modifiers }) {
    if (shouldAbort(modifiers)) {
      return
    }

    const ctx = el.__qripple
    el.removeEventListener('click', ctx.click, false)
    delete el.__qripple
  }
}
