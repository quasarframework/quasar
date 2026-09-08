import { createDirective } from '../../utils/private.create/create.js'
import { css } from '../../utils/dom/dom.js'
import { listenOpts, position, stop } from '../../utils/event/event.js'
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const enterDelay = 50
// waits out the browser's tap-vs-scroll disambiguation, so a
// flick-scroll started on the element gets cancelled before painting
const touchEnterDelay = 100
const keyThrottle = 300

const { passive } = listenOpts

// ctx.bound: which listener set is on the element
// 0: none (disabled), 1: click mode, 2: early mode
const listeners = [
  [],
  [
    ['click', onStart],
    ['keyup', onKey]
  ],
  [
    ['pointerdown', onStart],
    ['pointercancel', onCancel],
    ['pointerleave', onCancel],
    ['keydown', onKey]
  ]
]

function showRipple(evt, el, ctx, forceCenter) {
  if (ctx.stop) stop(evt)

  const color = ctx.color,
    center = ctx.center || forceCenter === true,
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
    transform: `translate(${x},${y}) scale(.2)`,
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
    innerNode.style.transform = `translate(${centerX},${centerY}) scale(1)`
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

// the listeners are shared by every element: the element is the
// event's currentTarget and its context hangs off it
function onStart(evt) {
  if (!evt.qSkipRipple) {
    const el = evt.currentTarget
    showRipple(evt, el, el.__qripple, evt.qKeyEvent === true)
  }
}

function onKey(evt) {
  const el = evt.currentTarget,
    ctx = el.__qripple

  if (!evt.qSkipRipple && isKeyCode(evt, ctx.keyCodes)) {
    const now = Date.now()
    if (now - ctx.keyTime >= keyThrottle) {
      ctx.keyTime = now
      showRipple(evt, el, ctx, true)
    }
  }
}

// the browser claimed the gesture (scroll/pan) or the pressed
// pointer was dragged off, so it can no longer become a tap
function onCancel(evt) {
  if (evt.type === 'pointerleave' && evt.buttons === 0) return

  const { ripples } = evt.currentTarget.__qripple

  // backwards since cancel() may splice the list
  for (let i = ripples.length - 1; i >= 0; i--) {
    const ripple = ripples[i]
    if (ripple.pointerId === evt.pointerId) {
      ripple.cancel()
    }
  }
}

// A compiled template builds a fresh modifiers object on every render of
// the host (the compiler does not hoist the literal), so an identity
// check alone would re-derive the options, and allocate, on every render
// of every rippled element. What the object says is what matters, and it
// can only say three things: the flags declared in Ripple.json, which is
// the list to extend along with this one. Reading them beats walking the
// keys and stays flat however many are set. A stable object from a
// withDirectives() caller (QBtn, QChip, QTab, StepHeader) settles on the
// first comparison, as does the shared empty object Vue substitutes for
// a directive written without modifiers. An undeclared key dropped in
// the modifiers slot still reaches setOptions() through the spread, but
// no longer brings a re-read of its own: it belongs in the value.
function modifiersChanged(a, b) {
  return (
    a !== b &&
    (a.early !== b.early || a.stop !== b.stop || a.center !== b.center)
  )
}

function setOptions(ctx, { modifiers, value, arg }) {
  const cfg = { ...ctx.cfg, ...modifiers, ...value }
  const keyCodes = cfg.keyCodes || 13

  // kept for the comparisons the next update makes
  ctx.arg = arg
  ctx.modifiers = modifiers

  ctx.early = cfg.early === true
  ctx.stop = cfg.stop === true
  ctx.center = cfg.center === true
  ctx.color = cfg.color || arg
  ctx.keyCodes = Array.isArray(keyCodes) ? keyCodes.flat() : keyCodes
}

function bind(el, ctx) {
  const bound = ctx.enabled ? (ctx.early ? 2 : 1) : 0

  if (bound !== ctx.bound) {
    for (const [name, fn] of listeners[ctx.bound]) {
      el.removeEventListener(name, fn, passive)
    }
    for (const [name, fn] of listeners[bound]) {
      el.addEventListener(name, fn, passive)
    }
    ctx.bound = bound
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
            cfg: cfg.ripple,
            enabled: binding.value !== false,
            arg: void 0,
            modifiers: void 0,
            early: false,
            stop: false,
            center: false,
            color: void 0,
            keyCodes: 13,
            keyTime: 0,
            bound: 0,
            ripples: []
          }

          setOptions(ctx, binding)
          el.__qripple = ctx
          bind(el, ctx)
        },

        // the argument and the modifiers are read by setOptions() alone, so
        // they only follow runtime changes if they take part in the decision
        // to call it; the value cannot stand in for them, and a value going
        // back to `true` has to drop what an earlier object set
        updated(el, binding) {
          const ctx = el.__qripple
          if (ctx === void 0) return

          const { value, oldValue, arg, modifiers } = binding

          ctx.enabled = value !== false

          if (
            ctx.enabled &&
            (value !== oldValue ||
              arg !== ctx.arg ||
              modifiersChanged(modifiers, ctx.modifiers))
          ) {
            setOptions(ctx, binding)
          }

          bind(el, ctx)
        },

        beforeUnmount(el) {
          const ctx = el.__qripple
          if (ctx === void 0) return

          ctx.ripples.forEach(ripple => {
            ripple.abort()
          })
          ctx.enabled = false
          bind(el, ctx)
          el.__qripple = void 0
        }
      }
)
