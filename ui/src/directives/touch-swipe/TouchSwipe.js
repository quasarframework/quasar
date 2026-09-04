import { client } from '../../plugins/platform/Platform.js'

import { createDirective } from '../../utils/private.create/create.js'
import {
  getModifierDirections,
  shouldStart
} from '../../utils/private.touch/touch.js'
import {
  leftClick,
  listenOpts,
  noop,
  position,
  preventDraggable,
  stopAndPrevent
} from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const { passive, passiveCapture, notPassive, notPassiveCapture } = listenOpts

// delta (min velocity -- dist / time)
// mobile min distance on first move
// desktop min distance until deciding if it's a swipe or not
const defaultSensitivity = [0.06, 6, 50]

function parseArg(ctx, arg) {
  ctx.arg = arg

  if (typeof arg !== 'string' || arg.length === 0) {
    ctx.sensitivity = defaultSensitivity
    return
  }

  const data = [...defaultSensitivity]
  const parts = arg.split(':')

  for (let i = 0; i < 3 && i < parts.length; i++) {
    const v = Number.parseFloat(parts[i])
    if (v) data[i] = v
  }

  ctx.sensitivity = data
}

// (re)binds the gesture start listeners to what the modifiers ask for,
// touching only the ones whose options changed
function bind(el, ctx, modifiers) {
  ctx.modifiers = modifiers
  ctx.direction = getModifierDirections(modifiers)

  // account for UMD too where modifiers will be lowercased to work
  const mouseCapture = modifiers.mouseCapture || modifiers.mousecapture
  const mouseOpts = modifiers.mouse
    ? mouseCapture
      ? passiveCapture
      : passive
    : null

  ctx.mouseMoveOpts = mouseCapture ? notPassiveCapture : notPassive

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
}

// the element listeners are shared by every element: the element is
// the event's currentTarget and its context hangs off it; the context
// itself listens for the rest of the gesture (EventListener interface)
function onMouseStart(evt) {
  const ctx = evt.currentTarget.__qtouchswipe

  if (shouldStart(evt, ctx) && leftClick(evt)) {
    ctx.target = document
    ctx.moveOpts = ctx.mouseMoveOpts
    document.addEventListener('mousemove', ctx, ctx.moveOpts)
    document.addEventListener('mouseup', ctx, notPassiveCapture)
    start(ctx, evt, true)
  }
}

function onTouchStart(evt) {
  const ctx = evt.currentTarget.__qtouchswipe

  if (shouldStart(evt, ctx)) {
    const { target } = evt
    ctx.target = target
    target.addEventListener('touchmove', ctx, notPassiveCapture)
    target.addEventListener('touchcancel', ctx, notPassiveCapture)
    target.addEventListener('touchend', ctx, notPassiveCapture)
    start(ctx, evt, false)
  }
}

function handleEvent(evt) {
  if (evt.type === 'mousemove' || evt.type === 'touchmove') {
    move(this, evt)
  } else {
    end(this, evt)
  }
}

function start(ctx, evt, mouse) {
  if (client.is.firefox) preventDraggable(ctx.el, true)

  const pos = position(evt)

  ctx.event = {
    x: pos.left,
    y: pos.top,
    time: Date.now(),
    mouse,
    dir: false
  }
}

function move(ctx, evt) {
  const { event } = ctx

  if (event === void 0) return

  if (event.dir !== false) {
    stopAndPrevent(evt)
    return
  }

  const time = Date.now() - event.time

  if (time === 0) return

  const pos = position(evt),
    distX = pos.left - event.x,
    absX = Math.abs(distX),
    distY = pos.top - event.y,
    absY = Math.abs(distY),
    { sensitivity, direction } = ctx

  if (!event.mouse) {
    if (absX < sensitivity[1] && absY < sensitivity[1]) {
      end(ctx, evt)
      return
    }
  }
  // is user trying to select text?
  // if so, then something should be reported here
  // (previous selection, if any, was discarded when swipe started)
  else if (window.getSelection().toString() !== '') {
    end(ctx, evt)
    return
  } else if (absX < sensitivity[2] && absY < sensitivity[2]) {
    return
  }

  const velX = absX / time,
    velY = absY / time

  if (
    direction.vertical &&
    absX < absY &&
    absX < 100 &&
    velY > sensitivity[0]
  ) {
    event.dir = distY < 0 ? 'up' : 'down'
  }

  if (
    direction.horizontal &&
    absX > absY &&
    absY < 100 &&
    velX > sensitivity[0]
  ) {
    event.dir = distX < 0 ? 'left' : 'right'
  }

  if (
    direction.up &&
    absX < absY &&
    distY < 0 &&
    absX < 100 &&
    velY > sensitivity[0]
  ) {
    event.dir = 'up'
  }

  if (
    direction.down &&
    absX < absY &&
    distY > 0 &&
    absX < 100 &&
    velY > sensitivity[0]
  ) {
    event.dir = 'down'
  }

  if (
    direction.left &&
    absX > absY &&
    distX < 0 &&
    absY < 100 &&
    velX > sensitivity[0]
  ) {
    event.dir = 'left'
  }

  if (
    direction.right &&
    absX > absY &&
    distX > 0 &&
    absY < 100 &&
    velX > sensitivity[0]
  ) {
    event.dir = 'right'
  }

  if (event.dir === false) {
    end(ctx, evt)
    return
  }

  stopAndPrevent(evt)

  if (event.mouse) {
    ctx.styled = true
    document.body.classList.add('no-pointer-events--children', 'non-selectable')
    clearSelection()
  }

  ctx.handler({
    evt,
    touch: !event.mouse,
    mouse: event.mouse,
    direction: event.dir,
    duration: time,
    distance: {
      x: absX,
      y: absY
    }
  })
}

function end(ctx, evt) {
  const { event, target } = ctx

  if (event === void 0) return

  if (event.mouse) {
    target.removeEventListener('mousemove', ctx, ctx.moveOpts)
    target.removeEventListener('mouseup', ctx, notPassiveCapture)
  } else {
    target.removeEventListener('touchmove', ctx, notPassiveCapture)
    target.removeEventListener('touchcancel', ctx, notPassiveCapture)
    target.removeEventListener('touchend', ctx, notPassiveCapture)
  }

  if (client.is.firefox) preventDraggable(ctx.el, false)

  if (ctx.styled) {
    ctx.styled = false
    // The classes must NOT be kept around after the gesture ended
    // (#18496): while no-pointer-events--children is set, nothing in
    // the page can be hit-tested, so a mousedown that follows shortly
    // after resolves to the document element instead of the element
    // the user actually pressed on.
    document.body.classList.remove(
      'no-pointer-events--children',
      'non-selectable'
    )
  }

  if (evt !== void 0 && event.dir !== false) stopAndPrevent(evt)

  ctx.event = void 0
  ctx.target = null
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-swipe', getSSRProps }
    : {
        name: 'touch-swipe',

        beforeMount(el, { value, arg, modifiers }) {
          const ctx = {
            handleEvent,
            el,
            handler: value,
            arg: void 0,
            sensitivity: void 0,
            modifiers: void 0,
            direction: void 0,
            mouseOpts: null,
            mouseMoveOpts: null,
            touchOpts: null,
            // the gesture listeners' target while a gesture is tracked
            target: null,
            moveOpts: null,
            event: void 0,
            styled: false
          }

          el.__qtouchswipe = ctx
          parseArg(ctx, arg)
          bind(el, ctx, modifiers)

          if (ctx.touchOpts !== null) {
            // cannot be passive (ex: iOS scroll)
            el.addEventListener('touchmove', noop, notPassiveCapture)
          }
        },

        updated(el, { oldValue, value, arg, modifiers }) {
          const ctx = el.__qtouchswipe

          if (oldValue !== value) {
            if (typeof value !== 'function') end(ctx)
            ctx.handler = value
          }

          if (arg !== ctx.arg) parseArg(ctx, arg)
          if (modifiers !== ctx.modifiers) bind(el, ctx, modifiers)
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchswipe

          end(ctx)

          if (ctx.mouseOpts !== null) {
            el.removeEventListener('mousedown', onMouseStart, ctx.mouseOpts)
          }

          if (ctx.touchOpts !== null) {
            el.removeEventListener('touchstart', onTouchStart, ctx.touchOpts)
            el.removeEventListener('touchmove', noop, notPassiveCapture)
          }

          el.__qtouchswipe = void 0
        }
      }
)
