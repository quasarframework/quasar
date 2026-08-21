import { createDirective } from '../../utils/private.create/create.js'
import { css } from '../../utils/dom/dom.js'
import { addEvt, cleanEvt, position, stop } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import throttle from '../../utils/throttle/throttle.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const enterDelay = 50
// waits out the browser's tap-vs-scroll disambiguation, so a
// flick-scroll started on the element gets cancelled before painting
const touchEnterDelay = 100

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

  let timer
  let phase = 0 // 0: pending, 1: entering, 2: leaving

  const finish = () => {
    node.remove()
    const index = ctx.ripples.indexOf(ripple)
    if (index !== -1) {
      ctx.ripples.splice(index, 1)
    }
  }

  const leave = () => {
    phase = 2
    innerNode.classList.remove('q-ripple__inner--enter')
    innerNode.classList.add('q-ripple__inner--leave')
    innerNode.style.opacity = 0
    timer = setTimeout(finish, 275)
  }

  const enter = () => {
    phase = 1
    innerNode.classList.add('q-ripple__inner--enter')
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`
    innerNode.style.opacity = 0.2
    timer = setTimeout(leave, 250)
  }

  const ripple = {
    // set only while the originating pointer can still turn into
    // a scroll/pan or be dragged off the element
    pointerId: evt.type === 'pointerdown' ? evt.pointerId : null,

    abort() {
      clearTimeout(timer)
      node.remove()
    },

    cancel() {
      ripple.pointerId = null
      if (phase === 2) return
      clearTimeout(timer)
      if (phase === 0) {
        finish()
      } else {
        leave()
      }
    }
  }

  ctx.ripples.push(ripple)

  timer = setTimeout(
    enter,
    evt.type === 'pointerdown' && evt.pointerType === 'touch'
      ? touchEnterDelay
      : enterDelay
  )
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

export default /*#__PURE__*/ createDirective(
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
            ripples: [],

            start(evt) {
              if (
                ctx.enabled &&
                !evt.qSkipRipple &&
                evt.type === (ctx.modifiers.early ? 'pointerdown' : 'click')
              ) {
                showRipple(evt, el, ctx, evt.qKeyEvent === true)
              }
            },

            // the browser claimed the gesture (scroll/pan) or the pressed
            // pointer was dragged off, so it can no longer become a tap
            cancel(evt) {
              if (evt.type === 'pointerleave' && evt.buttons === 0) return

              // backwards since cancel() may splice the list
              for (let i = ctx.ripples.length - 1; i >= 0; i--) {
                const ripple = ctx.ripples[i]
                if (ripple.pointerId === evt.pointerId) {
                  ripple.cancel()
                }
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
            [el, 'pointercancel', 'cancel', 'passive'],
            [el, 'pointerleave', 'cancel', 'passive'],
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
            ctx.ripples.forEach(ripple => {
              ripple.abort()
            })
            cleanEvt(ctx, 'main')
            delete el.__qripple
          }
        }
      }
)
