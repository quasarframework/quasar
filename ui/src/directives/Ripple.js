import { css } from '../utils/dom.js'
import { position, stop, listenOpts } from '../utils/event.js'
import { isKeyCode } from '../utils/key-composition.js'
import { client } from '../plugins/Platform.js'

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
    transform: `translate3d(${x},${y},0) scale3d(.2,.2,1)`,
    opacity: 0
  })

  node.className = `q-ripple${color ? ' text-' + color : ''}`
  node.setAttribute('dir', 'ltr')
  node.appendChild(innerNode)
  el.appendChild(node)

  const abort = () => {
    node.remove()
    clearTimeout(timer)
  }
  ctx.abort.push(abort)

  let timer = setTimeout(() => {
    innerNode.classList.add('q-ripple__inner--enter')
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`
    innerNode.style.opacity = 0.2

    timer = setTimeout(() => {
      innerNode.classList.remove('q-ripple__inner--enter')
      innerNode.classList.add('q-ripple__inner--leave')
      innerNode.style.opacity = 0

      timer = setTimeout(() => {
        node.remove()
        ctx.abort.splice(ctx.abort.indexOf(abort), 1)
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
        color: value.color || arg,
        keyCodes: [].concat(value.keyCodes || 13)
      }
      : {
        stop: modifiers.stop,
        center: modifiers.center,
        color: arg,
        keyCodes: [13]
      }
  }
}

export default {
  name: 'ripple',

  inserted (el, binding) {
    const ctx = {
      modifiers: {},
      abort: [],

      click (evt) {
        // on ENTER in form IE emits a PointerEvent with negative client cordinates
        if (
          ctx.enabled === true &&
          evt.qSkipRipple !== true &&
          (client.is.ie !== true || evt.clientX >= 0)
        ) {
          showRipple(evt, el, ctx, evt.qKeyEvent === true)
        }
      },

      keyup (evt) {
        if (
          ctx.enabled === true &&
          evt.qSkipRipple !== true &&
          isKeyCode(evt, ctx.modifiers.keyCodes) === true
        ) {
          showRipple(evt, el, ctx, true)
        }
      }
    }

    updateCtx(ctx, binding)

    if (el.__qripple) {
      el.__qripple_old = el.__qripple
    }

    el.__qripple = ctx
    el.addEventListener('click', ctx.click, listenOpts.passive)
    el.addEventListener('keyup', ctx.keyup, listenOpts.passive)
  },

  update (el, binding) {
    el.__qripple !== void 0 && updateCtx(el.__qripple, binding)
  },

  unbind (el) {
    const ctx = el.__qripple_old || el.__qripple
    if (ctx !== void 0) {
      ctx.abort.forEach(fn => { fn() })
      el.removeEventListener('click', ctx.click, listenOpts.passive)
      el.removeEventListener('keyup', ctx.keyup, listenOpts.passive)
      delete el[el.__qripple_old ? '__qripple_old' : '__qripple']
    }
  }
}
