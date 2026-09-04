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
  prevent,
  preventDraggable,
  stop,
  stopAndPrevent
} from '../../utils/event/event.js'
import { clearSelection } from '../../utils/private.selection/selection.js'
import getSSRProps from '../../utils/private.noop-ssr-directive-transform/noop-ssr-directive-transform.js'

const { passive, passiveCapture, notPassiveCapture } = listenOpts

let uid = 0

function getChanges(evt, ctx, isFinal) {
  const pos = position(evt)
  let dir,
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absX = Math.abs(distX),
    absY = Math.abs(distY)

  const direction = ctx.direction

  if (direction.horizontal && !direction.vertical) {
    dir = distX < 0 ? 'left' : 'right'
  } else if (!direction.horizontal && direction.vertical) {
    dir = distY < 0 ? 'up' : 'down'
  } else if (direction.up && distY < 0) {
    dir = 'up'
    if (absX > absY) {
      if (direction.left && distX < 0) {
        dir = 'left'
      } else if (direction.right && distX > 0) {
        dir = 'right'
      }
    }
  } else if (direction.down && distY > 0) {
    dir = 'down'
    if (absX > absY) {
      if (direction.left && distX < 0) {
        dir = 'left'
      } else if (direction.right && distX > 0) {
        dir = 'right'
      }
    }
  } else if (direction.left && distX < 0) {
    dir = 'left'
    if (absX < absY) {
      if (direction.up && distY < 0) {
        dir = 'up'
      } else if (direction.down && distY > 0) {
        dir = 'down'
      }
    }
  } else if (direction.right && distX > 0) {
    dir = 'right'
    if (absX < absY) {
      if (direction.up && distY < 0) {
        dir = 'up'
      } else if (direction.down && distY > 0) {
        dir = 'down'
      }
    }
  }

  let synthetic = false

  if (
    dir === void 0 &&
    /* can also be undefined */
    isFinal === false
  ) {
    if (ctx.event.isFirst || ctx.event.lastDir === void 0) {
      return {}
    }

    dir = ctx.event.lastDir
    synthetic = true

    if (dir === 'left' || dir === 'right') {
      pos.left -= distX
      absX = 0
      distX = 0
    } else {
      pos.top -= distY
      absY = 0
      distY = 0
    }
  }

  return {
    synthetic,
    payload: {
      evt,
      touch: ctx.event.mouse !== true,
      mouse: ctx.event.mouse === true,
      position: pos,
      direction: dir,
      isFirst: ctx.event.isFirst,
      isFinal: isFinal === true,
      duration: Date.now() - ctx.event.time,
      distance: {
        x: absX,
        y: absY
      },
      offset: {
        x: distX,
        y: distY
      },
      delta: {
        x: pos.left - ctx.event.lastX,
        y: pos.top - ctx.event.lastY
      }
    }
  }
}

// (re)binds the gesture start listeners to what the modifiers ask for,
// touching only the ones whose options changed
function bind(el, ctx, modifiers) {
  ctx.modifiers = modifiers
  ctx.direction = getModifierDirections(modifiers)
  ctx.stop = modifiers.stop === true
  ctx.prevent = modifiers.prevent === true
  // account for UMD too where modifiers will be lowercased to work
  ctx.mouseAllDir =
    modifiers.mouseAllDir === true || modifiers.mousealldir === true
  ctx.preserveCursor =
    modifiers.preserveCursor === true || modifiers.preservecursor === true

  const mouseOpts = modifiers.mouse
    ? modifiers.mouseCapture || modifiers.mousecapture
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
}

// the element listeners are shared by every element: the element is
// the event's currentTarget and its context hangs off it; the context
// itself listens for the rest of the gesture (EventListener interface)
function onMouseStart(evt) {
  const ctx = evt.currentTarget.__qtouchpan

  if (shouldStart(evt, ctx) && leftClick(evt)) {
    ctx.target = document
    document.addEventListener('mousemove', ctx, notPassiveCapture)
    document.addEventListener('mouseup', ctx, passiveCapture)
    start(ctx, evt, true)
  }
}

function onTouchStart(evt) {
  const ctx = evt.currentTarget.__qtouchpan

  if (shouldStart(evt, ctx)) {
    const { target } = evt
    ctx.target = target
    target.addEventListener('touchmove', ctx, notPassiveCapture)
    target.addEventListener('touchcancel', ctx, passiveCapture)
    target.addEventListener('touchend', ctx, passiveCapture)
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

function stopOrPrevent(ctx, evt, mouse) {
  if (mouse) {
    stopAndPrevent(evt)
  } else {
    if (ctx.stop) stop(evt)
    if (ctx.prevent) prevent(evt)
  }
}

function start(ctx, evt, mouse) {
  if (client.is.firefox) preventDraggable(ctx.el, true)
  ctx.lastEvt = evt

  /*
   * Stop propagation so possible upper v-touch-pan don't catch this as well;
   * If we're not the target (based on modifiers), we'll re-emit the event later
   */
  if (mouse || ctx.stop) {
    /*
     * are we directly switching to detected state?
     * clone event only otherwise
     */
    if (!ctx.direction.all && (!mouse || !ctx.mouseAllDir)) {
      const clone = evt.type.includes('mouse')
        ? new MouseEvent(evt.type, evt)
        : new TouchEvent(evt.type, evt)

      if (evt.defaultPrevented) prevent(clone)
      if (evt.cancelBubble) stop(clone)

      Object.assign(clone, {
        qKeyEvent: evt.qKeyEvent,
        qClickOutside: evt.qClickOutside,
        qAnchorHandled: evt.qAnchorHandled,
        qClonedBy:
          evt.qClonedBy === void 0
            ? [ctx.uid]
            : // oxlint-disable-next-line unicorn/prefer-spread
              evt.qClonedBy.concat(ctx.uid)
      })

      ctx.initialEvent = {
        target: evt.target,
        event: clone
      }
    }

    stop(evt)
  }

  const { left, top } = position(evt)

  ctx.event = {
    x: left,
    y: top,
    time: Date.now(),
    mouse,
    detected: false,
    isFirst: true,
    isFinal: false,
    lastX: left,
    lastY: top,
    lastDir: void 0
  }
}

function applyStyles(ctx, evt, mouse) {
  stopOrPrevent(ctx, evt, mouse)
  ctx.styled = true

  if (!ctx.preserveCursor) {
    ctx.cursor = document.documentElement.style.cursor || ''
    document.documentElement.style.cursor = 'grabbing'
  }

  if (mouse) {
    document.body.classList.add('no-pointer-events--children')
  }
  document.body.classList.add('non-selectable')
  clearSelection()
}

function restoreStyles(ctx, mouse) {
  ctx.styled = false

  if (ctx.cursor !== void 0) {
    document.documentElement.style.cursor = ctx.cursor
    ctx.cursor = void 0
  }

  document.body.classList.remove('non-selectable')

  if (mouse) {
    // The class must NOT be kept around after the gesture ended
    // (#18496): while it's set, nothing in the page can be
    // hit-tested, so a mousedown that follows shortly after
    // resolves to the document element instead of the element
    // the user actually pressed on. The "click" that the browser
    // emits after the gesture (#6597) is still swallowed, as its
    // target was already computed out of the mousedown/mouseup
    // targets, the latter one being hit-tested while the class
    // was still set.
    document.body.classList.remove('no-pointer-events--children')
  }
}

function move(ctx, evt) {
  const { event } = ctx

  if (event === void 0) return

  const pos = position(evt),
    distX = pos.left - event.x,
    distY = pos.top - event.y

  // prevent buggy browser behavior (like Blink-based engine ones on Windows)
  // where the mousemove event occurs even if there's no movement after mousedown
  // https://bugs.chromium.org/p/chromium/issues/detail?id=161464
  // https://bugs.chromium.org/p/chromium/issues/detail?id=721341
  // https://github.com/quasarframework/quasar/issues/10721
  if (distX === 0 && distY === 0) return

  ctx.lastEvt = evt

  const { mouse } = event

  if (event.detected) {
    if (!event.isFirst) {
      stopOrPrevent(ctx, evt, mouse)
    }

    const { payload, synthetic } = getChanges(evt, ctx, false)

    if (payload !== void 0) {
      if (ctx.handler(payload) === false) {
        end(ctx, evt)
      } else {
        if (!ctx.styled && event.isFirst) {
          applyStyles(ctx, evt, mouse)
        }

        event.lastX = payload.position.left
        event.lastY = payload.position.top
        event.lastDir = synthetic ? void 0 : payload.direction
        event.isFirst = false
      }
    }

    return
  }

  const { direction } = ctx

  if (direction.all || (mouse && ctx.mouseAllDir)) {
    applyStyles(ctx, evt, mouse)
    event.detected = true
    move(ctx, evt)
    return
  }

  const absX = Math.abs(distX),
    absY = Math.abs(distY)

  if (absX !== absY) {
    if (
      (direction.horizontal && absX > absY) ||
      (direction.vertical && absX < absY) ||
      (direction.up && absX < absY && distY < 0) ||
      (direction.down && absX < absY && distY > 0) ||
      (direction.left && absX > absY && distX < 0) ||
      (direction.right && absX > absY && distX > 0)
    ) {
      event.detected = true
      move(ctx, evt)
    } else {
      end(ctx, evt, true)
    }
  }
}

function end(ctx, evt, abort) {
  const { event, target } = ctx

  if (event === void 0) return

  const { mouse } = event

  if (mouse) {
    target.removeEventListener('mousemove', ctx, notPassiveCapture)
    target.removeEventListener('mouseup', ctx, passiveCapture)
  } else {
    target.removeEventListener('touchmove', ctx, notPassiveCapture)
    target.removeEventListener('touchcancel', ctx, passiveCapture)
    target.removeEventListener('touchend', ctx, passiveCapture)
  }

  if (client.is.firefox) preventDraggable(ctx.el, false)

  if (abort) {
    if (ctx.styled) restoreStyles(ctx, mouse)

    if (!event.detected && ctx.initialEvent !== void 0) {
      ctx.initialEvent.target.dispatchEvent(ctx.initialEvent.event)
    }
  } else if (event.detected) {
    if (evt === void 0) evt = ctx.lastEvt

    if (event.isFirst) {
      ctx.handler(getChanges(evt, ctx).payload)
    }

    const { payload } = getChanges(evt, ctx, true)
    // read the handler now so an updated() that disarms the directive
    // meanwhile (value no longer a function) still delivers the final
    // payload once the mouse style cleanup's delay is over
    const { handler } = ctx

    if (ctx.styled) {
      restoreStyles(ctx, mouse)

      if (mouse) {
        setTimeout(handler, 50, payload)
      } else {
        handler(payload)
      }
    } else {
      handler(payload)
    }
  }

  ctx.event = void 0
  ctx.initialEvent = void 0
  ctx.lastEvt = void 0
  ctx.target = null
}

export default /*#__PURE__*/ createDirective(
  __QUASAR_SSR_SERVER__
    ? { name: 'touch-pan', getSSRProps }
    : {
        name: 'touch-pan',

        beforeMount(el, { value, modifiers }) {
          const ctx = {
            handleEvent,
            el,
            uid: 'qvtp_' + uid++,
            handler: value,
            modifiers: void 0,
            direction: void 0,
            stop: false,
            prevent: false,
            mouseAllDir: false,
            preserveCursor: false,
            mouseOpts: null,
            touchOpts: null,
            // the gesture listeners' target while a gesture is tracked
            target: null,
            event: void 0,
            initialEvent: void 0,
            lastEvt: void 0,
            styled: false,
            cursor: void 0
          }

          el.__qtouchpan = ctx
          bind(el, ctx, modifiers)

          if (ctx.touchOpts !== null) {
            // cannot be passive (ex: iOS scroll)
            el.addEventListener('touchmove', noop, notPassiveCapture)
          }
        },

        updated(el, { oldValue, value, modifiers }) {
          const ctx = el.__qtouchpan

          if (oldValue !== value) {
            if (typeof value !== 'function') end(ctx)
            ctx.handler = value
          }

          if (modifiers !== ctx.modifiers) bind(el, ctx, modifiers)
        },

        beforeUnmount(el) {
          const ctx = el.__qtouchpan

          // emit the end event when the directive is destroyed while active
          // this is only needed in TouchPan because the rest of the touch directives do not emit an end event
          end(ctx)

          if (ctx.mouseOpts !== null) {
            el.removeEventListener('mousedown', onMouseStart, ctx.mouseOpts)
          }

          if (ctx.touchOpts !== null) {
            el.removeEventListener('touchstart', onTouchStart, ctx.touchOpts)
            el.removeEventListener('touchmove', noop, notPassiveCapture)
          }

          el.__qtouchpan = void 0
        }
      }
)
