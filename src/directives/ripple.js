import { css } from '../utils/dom.js'

function showRipple (evt, el, ctx) {
  if (ctx.modifiers.stop) {
    evt.stopPropagation()
  }

  const
    center = ctx.modifiers.center || evt.detail <= 0, // comes from keyboard event
    node = document.createElement('span'),
    innerNode = document.createElement('span'),

    { left, top, width, height } = el.getBoundingClientRect(),
    diameter = Math.sqrt(width * width + height * height),
    radius = diameter / 2,
    centerX = `${(width - diameter) / 2}px`,
    centerY = `${(height - diameter) / 2}px`,
    x = center ? centerX : `${evt.clientX - left - radius}px`,
    y = center ? centerY : `${evt.clientY - top - radius}px`

  node.className = 'q-ripple'
  ctx.arg && node.classList.add(`text-${ctx.arg}`)

  innerNode.className = 'q-ripple__inner'
  css(innerNode, {
    height: `${diameter}px`,
    width: `${diameter}px`,
    transform: `translate(${x}, ${y}) scale3d(0.3, 0.3, 0.3)`,
    opacity: 0
  })

  node.appendChild(innerNode)
  el.appendChild(node)

  ctx.timer = setTimeout(() => {
    innerNode.classList.add('q-ripple__inner--enter')
    innerNode.style.transform = `translate(${centerX}, ${centerY}) scale3d(1,1,1)`
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

export default {
  name: 'ripple',

  inserted (el, { value, modifiers, arg }) {
    const ctx = {
      enabled: value !== false,
      modifiers,
      arg,
      click (evt) {
        if (ctx.enabled) {
          showRipple(evt, el, ctx)
        }
      },
      keyup (evt) {
        if (ctx.enabled && !evt.defaultPrevented && evt.keyCode === 13) {
          showRipple(evt, el, ctx)
        }
      }
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, false)
    el.addEventListener('keyup', ctx.keyup, false)
  },

  update (el, { value, modifiers, arg }) {
    const ctx = el.__qripple
    if (ctx) {
      ctx.enabled = value !== false
      ctx.modifiers = modifiers
      ctx.arg = arg
    }
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
