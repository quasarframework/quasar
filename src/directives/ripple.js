import { cssTransform, css } from '../utils/dom'
import Platform from '../features/platform'
import { position } from '../utils/event'
import { current as theme } from '../features/theme'

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
  animNode.dataset.activated = Date.now()

  setTimeout(() => {
    animNode.classList.remove('q-ripple-animation-enter')
    css(animNode, cssTransform(`translate(-50%, -50%) translate(${x}px, ${y}px)`))
  }, 0)
}

function hideRipple (el) {
  const ripples = el.getElementsByClassName('q-ripple-animation')

  if (!ripples.length) {
    return
  }

  const animNode = ripples[ripples.length - 1]
  const diff = Date.now() - Number(animNode.dataset.activated)

  setTimeout(() => {
    animNode.classList.remove('q-ripple-animation-visible')

    setTimeout(() => {
      animNode.parentNode.remove()
    }, 300)
  }, Math.max(0, 400 - diff))
}

function shouldAbort ({mat, ios}) {
  return (
    (mat && theme !== 'mat') ||
    (ios && theme !== 'ios')
  )
}

export default {
  name: 'ripple',
  inserted (el, { value, modifiers }) {
    if (shouldAbort(modifiers)) {
      return
    }

    function show (evt) {
      if (ctx.enabled) {
        showRipple(evt, el, modifiers.stop)
      }
    }
    function hide () {
      if (ctx.enabled) {
        hideRipple(el)
      }
    }

    const
      ctx = {enabled: value !== false},
      h = {}

    if (Platform.is.desktop) {
      h.mousedown = show
      h.mouseup = hide
      h.mouseleave = hide
    }
    if (Platform.has.touch) {
      h.touchstart = show
      h.touchend = hide
      h.touchcancel = hide
    }

    ctx.h = h
    el.__qripple = ctx
    Object.keys(h).forEach(evt => {
      el.addEventListener(evt, h[evt], false)
    })
  },
  update (el, { value, oldValue }) {
    if (value !== oldValue) {
      el.__qripple.enabled = value !== false
    }
  },
  unbind (el, { modifiers }) {
    if (shouldAbort(modifiers)) {
      return
    }

    const ctx = el.__qripple
    Object.keys(ctx.h).forEach(evt => {
      el.removeEventListener(evt, ctx.h[evt], false)
    })
    delete el.__qripple
  }
}
