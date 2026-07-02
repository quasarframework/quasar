import { createDirective } from '../../utils/private.create/create.js'
import { css } from '../../utils/dom/dom.js'
import { addEvt, cleanEvt, position, stop } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import throttle from '../../utils/throttle/throttle.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

function showRipple(evt, el, ctx, forceCenter) {
  if (ctx.modifiers.stop) stop(evt)

  const color = ctx.modifiers.color,
    center = ctx.modifiers.center || forceCenter === true,
    node = document.createElement('span'),
    innerNode = document.createElement('span'),
    pos = position(evt),
    { left, top, width, height } = el.getBoundingClientRect(),
    diameter = Math.hypot(width, height),
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
  node.append(innerNode)
  el.append(node)

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

function updateModifiers(ctx, { modifiers, value, arg }) {
  const cfg = { ...ctx.cfg.ripple, ...modifiers, ...value }
  ctx.modifiers = {
    early: cfg.early === true,
    stop: cfg.stop === true,
    center: cfg.center === true,
    color: cfg.color || arg,
    keyCodes: [cfg.keyCodes || 13].flat()
  }
}

/**
 * @api directive
 * @docsUrl https://v2.quasar.dev/vue-directives/material-ripple
 */
export default createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'ripple', getSSRProps }
    : {
        name: 'ripple',

        beforeMount(el, binding) {
          const cfg =
            binding.instance.$.appContext.config.globalProperties.$q.config ||
            {}

          if (cfg.ripple === false) return

          const ctx = {
            cfg,
            enabled: binding.value !== false,
            modifiers: {},
            abort: [],

            start(evt) {
              if (
                ctx.enabled &&
                !evt.qSkipRipple &&
                evt.type === (ctx.modifiers.early ? 'pointerdown' : 'click')
              ) {
                showRipple(evt, el, ctx, evt.qKeyEvent === true)
              }
            },

            keystart: throttle(evt => {
              if (
                ctx.enabled &&
                !evt.qSkipRipple &&
                isKeyCode(evt, ctx.modifiers.keyCodes) &&
                evt.type === `key${ctx.modifiers.early ? 'down' : 'up'}`
              ) {
                showRipple(evt, el, ctx, true)
              }
            }, 300)
          }

          updateModifiers(ctx, binding)

          el.__qripple = ctx

          addEvt(ctx, 'main', [
            [el, 'pointerdown', 'start', 'passive'],
            [el, 'click', 'start', 'passive'],
            [el, 'keydown', 'keystart', 'passive'],
            [el, 'keyup', 'keystart', 'passive']
          ])
        },

        updated(el, binding) {
          if (binding.oldValue !== binding.value) {
            const ctx = el.__qripple
            if (ctx !== void 0) {
              ctx.enabled = binding.value !== false

              if (ctx.enabled && Object(binding.value) === binding.value) {
                updateModifiers(ctx, binding)
              }
            }
          }
        },

        beforeUnmount(el) {
          const ctx = el.__qripple
          if (ctx !== void 0) {
            ctx.abort.forEach(fn => {
              fn()
            })
            cleanEvt(ctx, 'main')
            delete el.__qripple
          }
        }
      }
)
