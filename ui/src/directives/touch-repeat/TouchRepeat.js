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
import { isKeyCode } from '../../utils/private.keyboard/key-composition.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const { passive, passiveCapture, notPassive, notPassiveCapture } = listenOpts

const keyCodes = new Map([
  ['esc', 27],
  ['tab', 9],
  ['enter', 13],
  ['space', 32],
  ['up', 38],
  ['left', 37],
  ['right', 39],
  ['down', 40],
  ['delete', [8, 46]]
])
const keyCodeRegex = /^[\d+]+$/

const defaultDurations = [0, 600, 300]

function parseKeyboard(modifiers) {
  const keyboard = []

  for (const key in modifiers) {
    const keyCode = keyCodes.get(key.toLowerCase())

    if (keyCode !== void 0) {
      if (Array.isArray(keyCode)) {
        keyboard.push(...keyCode)
      } else {
        keyboard.push(keyCode)
      }
    } else if (keyCodeRegex.test(key)) {
      keyboard.push(Number.parseInt(key, 10))
    }
  }

  return keyboard
}

function parseArg(ctx, arg) {
  ctx.arg = arg

  if (typeof arg !== 'string' || arg.length === 0) {
    ctx.durations = defaultDurations
    return
  }

  const durations = arg.split(':')
  for (let i = 0; i < durations.length; i++) {
    durations[i] = Number.parseInt(durations[i], 10)
  }
  ctx.durations = durations
}

// (re)binds the press start listeners to what the modifiers ask for,
// touching only the ones whose options changed
function bind(el, ctx, modifiers) {
  ctx.modifiers = modifiers
  ctx.keyboard = parseKeyboard(modifiers)

  const mouseOpts = modifiers.mouse
    ? // account for UMD too where modifiers will be lowercased to work
      modifiers.mouseCapture || modifiers.mousecapture
      ? passiveCapture
      : passive
    : null

  if (mouseOpts !== ctx.mouseOpts) {
    if (ctx.mouseOpts !== null) {
      el.removeEventListener('mousedown', onMouseStart, ctx.mouseOpts)
    }
    if (mouseOpts !== null) {
      el.addEventListener('mousedown', onMouseStart, mouseOpts)
    }
    ctx.mouseOpts = mouseOpts
  }

  const touchOpts = client.has.touch
    ? modifiers.capture
      ? passiveCapture
      : passive
    : null

  if (touchOpts !== ctx.touchOpts) {
    if (ctx.touchOpts !== null) {
      el.removeEventListener('touchstart', onTouchStart, ctx.touchOpts)
    }
    if (touchOpts !== null) {
      el.addEventListener('touchstart', onTouchStart, touchOpts)
    }
    ctx.touchOpts = touchOpts
  }

  const keyOpts =
    ctx.keyboard.length !== 0
      ? modifiers.keyCapture || modifiers.keycapture
        ? notPassiveCapture
        : notPassive
      : null

  if (keyOpts !== ctx.keyOpts) {
    if (ctx.keyOpts !== null) {
      el.removeEventListener('keydown', onKeyboardStart, ctx.keyOpts)
    }
    if (keyOpts !== null) {
      el.addEventListener('keydown', onKeyboardStart, keyOpts)
    }
    ctx.keyOpts = keyOpts
  }
}

function removeBodyNonSelectable() {
  document.body.classList.remove('non-selectable')
}

// the element listeners are shared by every element: the element is
// the event's currentTarget and its context hangs off it; the context
// itself listens for the rest of the press (EventListener interface)
function onMouseStart(evt) {
  const ctx = evt.currentTarget.__qtouchrepeat

  if (
    ctx.event === void 0 &&
    typeof ctx.handler === 'function' &&
    leftClick(evt)
  ) {
    ctx.target = document
    document.addEventListener('mousemove', ctx, passiveCapture)
    document.addEventListener('click', ctx, notPassiveCapture)
    start(ctx, evt, true, false)
  }
}

function onKeyboardStart(evt) {
  const el = evt.currentTarget,
    ctx = el.__qtouchrepeat

  if (typeof ctx.handler === 'function' && isKeyCode(evt, ctx.keyboard)) {
    if (ctx.durations[0] === 0 || ctx.event !== void 0) {
      stopAndPrevent(evt)
      el.focus()
      if (ctx.event !== void 0) return
    }

    ctx.target = document
    document.addEventListener('keyup', ctx, notPassiveCapture)
    document.addEventListener('click', ctx, notPassiveCapture)
    start(ctx, evt, false, true)
  }
}

function onTouchStart(evt) {
  const ctx = evt.currentTarget.__qtouchrepeat

  if (ctx.event === void 0 && typeof ctx.handler === 'function') {
    const { target } = evt
    ctx.target = target
    target.addEventListener('touchmove', ctx, passiveCapture)
    target.addEventListener('touchcancel', ctx, notPassiveCapture)
    target.addEventListener('touchend', ctx, notPassiveCapture)
    start(ctx, evt, false, false)
  }
}

function handleEvent(evt) {
  if (evt.type === 'mousemove' || evt.type === 'touchmove') {
    move(this, evt)
  } else {
    end(this, evt)
  }
}

function suppressStyles(ctx) {
  ctx.styled = true
  document.body.classList.add('non-selectable')
  clearSelection()
}

function restoreStyles(ctx) {
  if (ctx.styled) {
    ctx.styled = false
    document.documentElement.style.cursor = ''
    // delay needed otherwise selection still occurs
    clearSelection()
    setTimeout(removeBodyNonSelectable, 10)
  }
}

function start(ctx, evt, mouse, keyboard) {
  ctx.evt = evt
  ctx.origin = keyboard ? void 0 : position(evt)

  // a touch long-press starts native text selection right away
  // (on any touch-capable device, not just mobile UAs), so it
  // gets suppressed immediately; mouse/keyboard interactions
  // wait for the first repeat below to avoid flashing styles
  // on a quick click
  if (!mouse && !keyboard) {
    suppressStyles(ctx)
  }

  ctx.event = {
    touch: !mouse && !keyboard,
    mouse,
    keyboard,
    startTime: Date.now(),
    repeatCount: 0
  }

  if (ctx.durations[0] === 0) {
    tick(ctx)
  } else {
    ctx.timer = setTimeout(tick, ctx.durations[0], ctx)
  }
}

function tick(ctx) {
  ctx.timer = void 0

  const { event } = ctx

  if (event === void 0) return

  if (event.repeatCount === 0) {
    event.evt = ctx.evt

    if (event.keyboard) {
      event.keyCode = ctx.evt.keyCode
    } else {
      event.position = ctx.origin
    }

    if (!event.touch) {
      document.documentElement.style.cursor = 'pointer'
      suppressStyles(ctx)
    }
  }

  event.duration = Date.now() - event.startTime
  event.repeatCount += 1

  ctx.handler(event)

  const { durations } = ctx
  const last = durations.length - 1
  const index = last < event.repeatCount ? last : event.repeatCount

  ctx.timer = setTimeout(tick, durations[index], ctx)
}

function move(ctx, evt) {
  if (ctx.event !== void 0 && ctx.timer !== void 0) {
    const { top, left } = position(evt)

    if (
      Math.abs(left - ctx.origin.left) >= 7 ||
      Math.abs(top - ctx.origin.top) >= 7
    ) {
      clearTimeout(ctx.timer)
      ctx.timer = void 0
    }
  }
}

function end(ctx, evt) {
  const { event, target } = ctx

  if (event === void 0) return

  restoreStyles(ctx)
  if (evt !== void 0 && event.repeatCount > 0) {
    stopAndPrevent(evt)
  }

  if (event.mouse) {
    target.removeEventListener('mousemove', ctx, passiveCapture)
    target.removeEventListener('click', ctx, notPassiveCapture)
  } else if (event.keyboard) {
    target.removeEventListener('keyup', ctx, notPassiveCapture)
    target.removeEventListener('click', ctx, notPassiveCapture)
  } else {
    target.removeEventListener('touchmove', ctx, passiveCapture)
    target.removeEventListener('touchcancel', ctx, notPassiveCapture)
    target.removeEventListener('touchend', ctx, notPassiveCapture)
  }

  if (ctx.timer !== void 0) {
    clearTimeout(ctx.timer)
    ctx.timer = void 0
  }

  ctx.event = void 0
  ctx.evt = void 0
  ctx.target = null
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-repeat', getSSRProps }
    : {
        name: 'touch-repeat',

        beforeMount(el, { modifiers, value, arg }) {
          const ctx = {
            handleEvent,
            handler: value,
            arg: void 0,
            durations: defaultDurations,
            modifiers: void 0,
            keyboard: void 0,
            mouseOpts: null,
            touchOpts: null,
            keyOpts: null,
            // the press listeners' target while a press is tracked
            target: null,
            event: void 0,
            evt: void 0,
            origin: void 0,
            timer: void 0,
            styled: false
          }

          el.__qtouchrepeat = ctx
          parseArg(ctx, arg)
          bind(el, ctx, modifiers)

          if (ctx.touchOpts !== null) {
            el.addEventListener('touchend', noop, passiveCapture)
          }
        },

        updated(el, { oldValue, value, arg, modifiers }) {
          const ctx = el.__qtouchrepeat

          if (oldValue !== value) {
            if (typeof value !== 'function') end(ctx)
            ctx.handler = value
          }

          if (arg !== ctx.arg) parseArg(ctx, arg)
          if (modifiers !== ctx.modifiers) bind(el, ctx, modifiers)
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchrepeat

          end(ctx)

          if (ctx.mouseOpts !== null) {
            el.removeEventListener('mousedown', onMouseStart, ctx.mouseOpts)
          }

          if (ctx.touchOpts !== null) {
            el.removeEventListener('touchstart', onTouchStart, ctx.touchOpts)
            el.removeEventListener('touchend', noop, passiveCapture)
          }

          if (ctx.keyOpts !== null) {
            el.removeEventListener('keydown', onKeyboardStart, ctx.keyOpts)
          }

          el.__qtouchrepeat = void 0
        }
      }
)
