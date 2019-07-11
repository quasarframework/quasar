import Platform from '../plugins/Platform.js'
import { setObserver, removeObserver, getModifierDirections, updateModifiers } from '../utils/touch.js'
import { position, leftClick, listenOpts, prevent, stop, stopAndPrevent, preventDraggable } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

function getChanges (evt, ctx, isFinal) {
  let
    pos = position(evt),
    dir,
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absX = Math.abs(distX),
    absY = Math.abs(distY)

  const direction = ctx.direction

  if (direction.horizontal === true && direction.vertical !== true) {
    dir = distX < 0 ? 'left' : 'right'
  }
  else if (direction.horizontal !== true && direction.vertical === true) {
    dir = distY < 0 ? 'up' : 'down'
  }
  else if (direction.up === true && distY < 0) {
    dir = 'up'
    if (absX > absY) {
      if (direction.left === true && distX < 0) {
        dir = 'left'
      }
      else if (direction.right === true && distX > 0) {
        dir = 'right'
      }
    }
  }
  else if (direction.down === true && distY > 0) {
    dir = 'down'
    if (absX > absY) {
      if (direction.left === true && distX < 0) {
        dir = 'left'
      }
      else if (direction.right === true && distX > 0) {
        dir = 'right'
      }
    }
  }
  else if (direction.left === true && distX < 0) {
    dir = 'left'
    if (absX < absY) {
      if (direction.up === true && distY < 0) {
        dir = 'up'
      }
      else if (direction.down === true && distY > 0) {
        dir = 'down'
      }
    }
  }
  else if (direction.right === true && distX > 0) {
    dir = 'right'
    if (absX < absY) {
      if (direction.up === true && distY < 0) {
        dir = 'up'
      }
      else if (direction.down === true && distY > 0) {
        dir = 'down'
      }
    }
  }

  if (dir === void 0 && isFinal !== true) {
    return
  }

  return {
    evt,
    touch: ctx.event.mouse !== true,
    mouse: ctx.event.mouse,
    position: pos,
    direction: dir,
    isFirst: ctx.event.isFirst,
    isFinal: isFinal === true,
    duration: new Date().getTime() - ctx.event.time,
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

const mouseEvtOpts = listenOpts.notPassiveCapture

export default {
  name: 'touch-pan',

  bind (el, { value, modifiers }) {
    if (el.__qtouchpan) {
      el.__qtouchpan_old = el.__qtouchpan
    }

    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const
      touchPassiveStr = modifiers.mightPrevent !== true && modifiers.prevent !== true
        ? 'passive'
        : 'notPassive',
      touchEvtOpts = listenOpts[touchPassiveStr + (modifiers.capture === true ? 'Capture' : '')]

    function handleEvent (evt, mouseEvent) {
      if (modifiers.mouse === true && mouseEvent === true) {
        stopAndPrevent(evt)
      }
      else {
        modifiers.stop && stop(evt)
        modifiers.prevent && prevent(evt)
      }
    }

    const ctx = {
      handler: value,
      modifiers,
      direction: getModifierDirections(modifiers),

      mouseStart (evt) {
        if (leftClick(evt)) {
          // stop propagation so possible upper v-touch-pan don't catch this as well
          modifiers.mouseAllDir === true && stop(evt)

          document.addEventListener('mousemove', ctx.move, mouseEvtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, mouseEvtOpts)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, mouseEvtOpts)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        Platform.is.firefox === true && preventDraggable(el, true)
        removeObserver(ctx)
        mouseEvent !== true && setObserver(el, evt, ctx)

        const pos = position(evt)

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          mouse: mouseEvent === true,
          detected: false,
          abort: false,
          isFirst: true,
          isFinal: false,
          lastX: pos.left,
          lastY: pos.top
        }
      },

      move (evt) {
        if (ctx.event === void 0 || ctx.event.abort === true) {
          return
        }

        if (ctx.event.detected === true) {
          ctx.event.isFirst !== true && handleEvent(evt, ctx.event.mouse)

          const changes = getChanges(evt, ctx, false)

          if (changes !== void 0) {
            if (ctx.handler(changes) === false) {
              ctx.mouseEnd(evt)
            }
            else {
              if (ctx.event.isFirst === true) {
                handleEvent(evt, ctx.event.mouse)
                document.documentElement.style.cursor = 'grabbing'
                document.body.classList.add('no-pointer-events')
                document.body.classList.add('non-selectable')
                clearSelection()
              }
              ctx.event.lastX = changes.position.left
              ctx.event.lastY = changes.position.top
              ctx.event.isFirst = false
            }
          }

          return
        }

        if (
          ctx.direction.all === true ||
          (ctx.event.mouse === true && modifiers.mouseAllDir === true)
        ) {
          ctx.event.detected = true
          ctx.move(evt)
          return
        }

        const
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y,
          absX = Math.abs(distX),
          absY = Math.abs(distY)

        if (absX === absY) {
          return
        }

        if (
          (ctx.direction.horizontal === true && absX > absY) ||
          (ctx.direction.vertical === true && absX < absY) ||
          (ctx.direction.up === true && absX < absY && distY < 0) ||
          (ctx.direction.down === true && absX < absY && distY > 0) ||
          (ctx.direction.left === true && absX > absY && distX < 0) ||
          (ctx.direction.right === true && absX > absY && distX > 0)
        ) {
          ctx.event.detected = true
          ctx.move(evt)
        }
        else {
          ctx.event.abort = true
        }
      },

      end (evt) {
        if (ctx.event === void 0) {
          return
        }

        Platform.is.firefox === true && preventDraggable(el, false)
        ctx.event.mouse !== true && removeObserver(ctx)

        document.documentElement.style.cursor = ''
        document.body.classList.remove('no-pointer-events')
        document.body.classList.remove('non-selectable')

        if (
          ctx.event.abort !== true &&
          ctx.event.detected === true &&
          ctx.event.isFirst !== true
        ) {
          handleEvent(evt, ctx.event.mouse)
          ctx.handler(getChanges(evt, ctx, true))
        }

        ctx.event = void 0
      }
    }

    el.__qtouchpan = ctx

    if (modifiers.mouse === true) {
      el.addEventListener(
        'mousedown',
        ctx.mouseStart,
        listenOpts[`notPassive${modifiers.mouseCapture === true ? 'Capture' : ''}`]
      )
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.start, touchEvtOpts)
      el.addEventListener('touchmove', ctx.move, touchEvtOpts)
      el.addEventListener('touchcancel', ctx.end, modifiers.capture)
      el.addEventListener('touchend', ctx.end, modifiers.capture)
    }
  },

  update (el, binding) {
    const ctx = el.__qtouchpan
    if (ctx !== void 0) {
      updateModifiers(ctx, binding)
    }
  },

  unbind (el, { modifiers }) {
    let ctx = el.__qtouchpan_old || el.__qtouchpan

    if (ctx !== void 0) {
      Platform.is.firefox === true && preventDraggable(el, false)
      removeObserver(ctx)

      document.documentElement.style.cursor = ''
      document.body.classList.remove('no-pointer-events')
      document.body.classList.remove('non-selectable')

      const
        touchPassiveStr = modifiers.mightPrevent !== true && modifiers.prevent !== true
          ? 'passive'
          : 'notPassive',
        touchEvtOpts = listenOpts[touchPassiveStr + (modifiers.capture === true ? 'Capture' : '')]

      if (modifiers.mouse === true) {
        el.removeEventListener(
          'mousedown',
          ctx.mouseStart,
          listenOpts[`notPassive${modifiers.mouseCapture === true ? 'Capture' : ''}`]
        )
        document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, mouseEvtOpts)
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.start, touchEvtOpts)
        el.removeEventListener('touchmove', ctx.move, touchEvtOpts)
        el.removeEventListener('touchcancel', ctx.end, modifiers.capture)
        el.removeEventListener('touchend', ctx.end, modifiers.capture)
      }

      delete el[el.__qtouchpan_old ? '__qtouchpan_old' : '__qtouchpan']
    }
  }
}
