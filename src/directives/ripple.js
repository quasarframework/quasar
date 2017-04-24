import { cssTransform, css } from '../utils/dom'
import Platform from '../features/platform'
import { position } from '../utils/event'
import { add, get, remove } from '../utils/store'
import { current as theme } from '../features/theme'

function showRipple (evt, el, stopPropagation) {
  if (stopPropagation) {
    evt.stopPropagation()
  }

  var container = document.createElement('span')
  var animNode = document.createElement('span')

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

function shouldAbort ({modifiers, value}) {
  return (
    value ||
    (modifiers.mat && theme !== 'mat') ||
    (modifiers.ios && theme !== 'ios')
  )
}

export default {
  name: 'ripple',
  bind (el, bindings) {
    if (shouldAbort(bindings)) {
      return
    }

    function show (evt) { showRipple(evt, el, bindings.modifiers.stop) }
    function hide () { hideRipple(el) }

    const ctx = {}

    if (Platform.is.desktop) {
      ctx.mousedown = show
      ctx.mouseup = hide
      ctx.mouseleave = hide
    }
    if (Platform.has.touch) {
      ctx.touchstart = show
      ctx.touchend = hide
      ctx.touchcancel = hide
    }

    add('ripple', el, ctx)
    Object.keys(ctx).forEach(evt => {
      el.addEventListener(evt, ctx[evt], false)
    })
  },
  unbind (el, bindings) {
    if (shouldAbort(bindings)) {
      return
    }

    const ctx = get('ripple', el)
    Object.keys(ctx).forEach(evt => {
      el.removeEventListener(evt, ctx[evt], false)
    })
    remove('ripple', el)
  }
}
