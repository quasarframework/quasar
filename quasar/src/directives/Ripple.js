import { css } from '../utils/dom.js'
import { position, stop } from '../utils/event.js'

function showRipple (evt, el, ctx, forceCenter) {
  ctx.modifiers.stop === true && stop(evt)

  let { center, color } = ctx.modifiers
  center = center === true || forceCenter === true

  const
    node = document.createElement('span'),
    innerNode = document.createElement('span'),
    pos = position(evt),
    { left, top, width, height } = el.getBoundingClientRect(),
    diameter = Math.sqrt(width * width + height * height),
    radius = diameter / 2,
    centerX = `${(width - diameter) / 2}px`,
    x = center ? centerX : `${pos.left - left - radius}px`,
    centerY = `${(height - diameter) / 2}px`,
    y = center ? centerY : `${pos.top - top - radius}px`

  innerNode.className = 'q-ripple__inner'
  css(innerNode, {
    height: `${diameter}px`,
    width: `${diameter}px`,
    transform: `translate3d(${x}, ${y}, 0) scale3d(0.2, 0.2, 1)`,
    opacity: 0
  })

  node.className = `q-ripple${color ? ' text-' + color : ''}`
  node.setAttribute('dir', 'ltr')
  node.appendChild(innerNode)
  el.appendChild(node)

  ctx.abort = () => {
    node && node.remove()
    clearTimeout(timer)
  }

  let timer = setTimeout(() => {
    innerNode.classList.add('q-ripple__inner--enter')
    innerNode.style.transform = `translate3d(${centerX}, ${centerY}, 0) scale3d(1, 1, 1)`
    innerNode.style.opacity = 0.2

    timer = setTimeout(() => {
      innerNode.classList.remove('q-ripple__inner--enter')
      innerNode.classList.add('q-ripple__inner--leave')
      innerNode.style.opacity = 0

      timer = setTimeout(() => {
        node && node.remove()
        ctx.abort = void 0
      }, 275)
    }, 250)
  }, 50)
}

function updateCtx (ctx, { value, modifiers, arg }) {
  ctx.enabled = value !== false

  if (ctx.enabled === true) {
    ctx.modifiers = Object(value) === value
      ? {
        stop: value.stop === true || modifiers.stop === true,
        center: value.center === true || modifiers.center === true,
        color: value.color || arg
      }
      : {
        stop: modifiers.stop,
        center: modifiers.center,
        color: arg
      }
  }
}

export default {
  name: 'ripple',

  inserted (el, binding) {
    const ctx = {
      modifiers: {},

      click (evt) {
        if (ctx.enabled === true && evt.qKeyEvent !== true) {
          showRipple(evt, el, ctx)
        }
      },

      keyup (evt) {
        if (ctx.enabled === true && evt.keyCode === 13) {
          showRipple(evt, el, ctx, true)
        }
      }
    }

    updateCtx(ctx, binding)

    if (el.__qripple) {
      el.__qripple_old = el.__qripple
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
    el.addEventListener('keyup', ctx.keyup, false)
  },

  update (el, binding) {
    el.__qripple !== void 0 && updateCtx(el.__qripple, binding)
  },

  unbind (el) {
    const ctx = el.__qripple_old || el.__qripple
    if (ctx !== void 0) {
      ctx.abort !== void 0 && ctx.abort()
      el.removeEventListener('click', ctx.click, false)
      el.removeEventListener('keyup', ctx.keyup, false)
      delete el[el.__qripple_old ? '__qripple_old' : '__qripple']
    }
  }
}
