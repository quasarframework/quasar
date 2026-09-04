import { client } from '../../plugins/platform/Platform.js'

import { createDirective } from '../../utils/private.create/create.js'
import {
  leftClick,
  listenOpts,
  noop,
  position,
  stopAndPrevent
} from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const { passive, passiveCapture, notPassiveCapture } = listenOpts

function parseNumber(val, fallback) {
  return Number.parseInt(val, 10) || fallback
}

function removeBodyNonSelectable() {
  document.body.classList.remove('non-selectable')
}

// the element listeners are shared by every element: the element is
// the event's currentTarget and its context hangs off it; the context
// itself listens for the rest of the press (EventListener interface)
function onMouseStart(evt) {
  const ctx = evt.currentTarget.__qtouchhold

  if (
    ctx.target === null &&
    typeof ctx.handler === 'function' &&
    leftClick(evt)
  ) {
    ctx.target = document
    ctx.mouse = true
    document.addEventListener('mousemove', ctx, passiveCapture)
    document.addEventListener('click', ctx, notPassiveCapture)
    start(ctx, evt)
  }
}

function onTouchStart(evt) {
  const ctx = evt.currentTarget.__qtouchhold

  if (ctx.target === null && typeof ctx.handler === 'function') {
    const { target } = evt
    ctx.target = target
    ctx.mouse = false
    target.addEventListener('touchmove', ctx, passiveCapture)
    target.addEventListener('touchcancel', ctx, notPassiveCapture)
    target.addEventListener('touchend', ctx, notPassiveCapture)
    start(ctx, evt)
  }
}

function handleEvent(evt) {
  if (evt.type === 'mousemove' || evt.type === 'touchmove') {
    move(this, evt)
  } else {
    end(this, evt)
  }
}

function start(ctx, evt) {
  ctx.evt = evt
  ctx.origin = position(evt)
  ctx.startTime = Date.now()
  ctx.triggered = false
  ctx.sensitivity = ctx.mouse ? ctx.mouseSensitivity : ctx.touchSensitivity

  // a touch long-press starts native text selection (on any
  // touch-capable device, not just mobile UAs); a held mouse
  // button does not, so it needs no suppression
  if (!ctx.mouse) {
    document.body.classList.add('non-selectable')
    clearSelection()
  }

  ctx.timer = setTimeout(trigger, ctx.duration, ctx)
}

function trigger(ctx) {
  ctx.timer = void 0
  clearSelection()
  ctx.triggered = true

  ctx.handler({
    evt: ctx.evt,
    touch: !ctx.mouse,
    mouse: ctx.mouse,
    position: ctx.origin,
    duration: Date.now() - ctx.startTime
  })
}

function move(ctx, evt) {
  if (ctx.timer !== void 0) {
    const { top, left } = position(evt)

    if (
      Math.abs(left - ctx.origin.left) >= ctx.sensitivity ||
      Math.abs(top - ctx.origin.top) >= ctx.sensitivity
    ) {
      clearTimeout(ctx.timer)
      ctx.timer = void 0
    }
  }
}

function end(ctx, evt) {
  const { target } = ctx

  if (target === null) return

  ctx.target = null
  ctx.evt = void 0

  if (ctx.mouse) {
    target.removeEventListener('mousemove', ctx, passiveCapture)
    target.removeEventListener('click', ctx, notPassiveCapture)
  } else {
    target.removeEventListener('touchmove', ctx, passiveCapture)
    target.removeEventListener('touchcancel', ctx, notPassiveCapture)
    target.removeEventListener('touchend', ctx, notPassiveCapture)

    if (ctx.triggered) {
      // delay needed otherwise selection still occurs
      clearSelection()
      setTimeout(removeBodyNonSelectable, 10)
    } else {
      removeBodyNonSelectable()
    }
  }

  if (ctx.triggered) {
    if (evt !== void 0) stopAndPrevent(evt)
  } else if (ctx.timer !== void 0) {
    clearTimeout(ctx.timer)
    ctx.timer = void 0
  }
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-hold', getSSRProps }
    : {
        name: 'touch-hold',

        beforeMount(el, { value, arg, modifiers }) {
          const hasTouch = client.has.touch

          // early return, we don't need to do anything
          if (!modifiers.mouse && !hasTouch) return

          let duration = 600,
            touchSensitivity = 5,
            mouseSensitivity = 7

          if (typeof arg === 'string' && arg.length !== 0) {
            const parts = arg.split(':')
            duration = parseNumber(parts[0], duration)
            touchSensitivity = parseNumber(parts[1], touchSensitivity)
            mouseSensitivity = parseNumber(parts[2], mouseSensitivity)
          }

          const ctx = {
            handleEvent,
            handler: value,
            duration,
            touchSensitivity,
            mouseSensitivity,
            mouseOpts: null,
            touchOpts: null,
            // the press listeners' target while a press is tracked
            target: null,
            mouse: false,
            evt: void 0,
            origin: void 0,
            startTime: 0,
            sensitivity: 0,
            timer: void 0,
            triggered: false
          }

          el.__qtouchhold = ctx

          if (modifiers.mouse) {
            // account for UMD too where modifiers will be lowercased to work
            ctx.mouseOpts =
              modifiers.mouseCapture || modifiers.mousecapture
                ? passiveCapture
                : passive
            el.addEventListener('mousedown', onMouseStart, ctx.mouseOpts)
          }

          if (hasTouch) {
            ctx.touchOpts = modifiers.capture ? passiveCapture : passive
            el.addEventListener('touchstart', onTouchStart, ctx.touchOpts)
            el.addEventListener('touchend', noop, notPassiveCapture)
          }
        },

        updated(el, { oldValue, value }) {
          const ctx = el.__qtouchhold

          if (ctx !== void 0 && oldValue !== value) {
            if (typeof value !== 'function') end(ctx)
            ctx.handler = value
          }
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchhold

          if (ctx !== void 0) {
            end(ctx)

            if (ctx.mouseOpts !== null) {
              el.removeEventListener('mousedown', onMouseStart, ctx.mouseOpts)
            }

            if (ctx.touchOpts !== null) {
              el.removeEventListener('touchstart', onTouchStart, ctx.touchOpts)
              el.removeEventListener('touchend', noop, notPassiveCapture)
            }

            el.__qtouchhold = void 0
          }
        }
      }
)
