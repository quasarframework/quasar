import { css } from '../utils/dom.js'
import { position } from '../utils/event.js'

function showRipple (evt, el, ctx) {
  if (ctx.modifiers.stop === true) {
    evt.stopPropagation()
  }

  let { center, color } = ctx.modifiers
  center = center || evt instanceof KeyboardEvent // comes from keyboard event

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
    transform: `translate3d(${x}, ${y}, 0) scale3d(0.3, 0.3, 1)`,
    opacity: 0
  })

  node.className = `q-ripple ${color ? ' text-' + color : ''}`
  node.appendChild(innerNode)
  el.appendChild(node)

  ctx.timer = setTimeout(() => {
    innerNode.classList.add('q-ripple__inner--enter')
    innerNode.style.transform = `translate3d(${centerX}, ${centerY}, 0) scale3d(1, 1, 1)`
    innerNode.style.opacity = 0.2

    ctx.timer = setTimeout(() => {
      innerNode.classList.remove('q-ripple__inner--enter')
      innerNode.classList.add('q-ripple__inner--leave')
      innerNode.style.opacity = 0

      ctx.timer = setTimeout(() => {
        node && node.remove()
      }, 275)
    }, 250)
  }, 50)
}

function updateCtx (ctx, { value, modifiers, arg }) {
  ctx.enabled = value !== false

  if (ctx.enabled) {
    ctx.modifiers = Object(value) === value
      ? {
        stop: value.stop || modifiers.stop,
        center: value.center || modifiers.center,
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
        if (ctx.enabled && !evt.preventRipple) {
          showRipple(evt, el, ctx)
        }
      },

      keyup (evt) {
        if (ctx.enabled && !evt.preventRipple && evt.keyCode === 13) {
          showRipple(evt, el, ctx)
        }
      }
    }

    updateCtx(ctx, binding)

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
    el.addEventListener('keyup', ctx.keyup, false)
  },

  update (el, binding) {
    el.__qripple && updateCtx(el.__qripple, binding)
  },

  unbind (el) {
    const ctx = el.__qripple
    if (ctx) {
      clearTimeout(ctx.timer)
      el.removeEventListener('click', ctx.click, false)
      el.removeEventListener('keyup', ctx.keyup, false)
      delete el.__qripple
    }
  }
}
