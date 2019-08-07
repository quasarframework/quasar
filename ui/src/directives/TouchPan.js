import Platform from '../plugins/Platform.js'
import { getModifierDirections, updateModifiers } from '../utils/touch.js'
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

const { notPassiveCapture } = listenOpts

export default {
  name: 'touch-pan',

  bind (el, { value, modifiers }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const
      touchPassiveStr = modifiers.mightPrevent !== true && modifiers.prevent !== true
        ? 'passive'
        : 'notPassive',
      touchEvtOpts = listenOpts[touchPassiveStr + (modifiers.capture === true ? 'Capture' : '')],
      mouseEvtOpts = listenOpts['notPassive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

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
        if (ctx.event === void 0 && leftClick(evt)) {
          // stop propagation so possible upper v-touch-pan don't catch this as well
          modifiers.mouseAllDir === true && stop(evt)

          document.addEventListener('mousemove', ctx.move, mouseEvtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
        ctx.end(evt)
      },

      touchStart (evt) {
        const touchTarget = evt.target
        if (ctx.event === void 0 && touchTarget !== void 0) {
          ctx.touchTarget = touchTarget
          touchTarget.addEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          touchTarget.addEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          ctx.start(evt)
        }
      },

      touchEnd (evt) {
        const touchTarget = ctx.touchTarget
        if (touchTarget !== void 0) {
          touchTarget.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
          touchTarget.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
        }
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        Platform.is.firefox === true && preventDraggable(el, true)

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

        if (ctx.event.detected !== true) {
          if (ctx.direction.all === true || (ctx.event.mouse === true && modifiers.mouseAllDir === true)) {
            ctx.event.detected = true
          }
          else {
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
            }
            else {
              ctx.event.abort = true

              return
            }
          }
        }

        if (ctx.event.isFirst === true) {
          const fn = (modifiers.mouse === true && ctx.event.mouse === true) || (modifiers.stop === true && modifiers.prevent === true)
            ? stopAndPrevent
            : (modifiers.stop === true
              ? stop
              : (modifiers.prevent === true ? prevent : void 0)
            )
          fn !== void 0 && document.addEventListener('click', fn, notPassiveCapture)

          if (ctx.event.mouse === true) {
            document.documentElement.style.cursor = 'grabbing'
            document.body.classList.add('non-selectable')
            clearSelection()
          }
        }
        else {
          handleEvent(evt, ctx.event.mouse)
        }

        const changes = getChanges(evt, ctx, false)

        if (changes !== void 0) {
          if (ctx.handler(changes) === false) {
            ctx.event.abort = true
            if (ctx.event.mouse === true) {
              ctx.mouseEnd(evt)
            }
            else {
              ctx.touchEnd(evt)
            }
          }
          else {
            if (ctx.event.isFirst === true) {
              handleEvent(evt, ctx.event.mouse)
              ctx.event.isFirst = false
            }
            ctx.event.lastX = changes.position.left
            ctx.event.lastY = changes.position.top
          }
        }
      },

      end (evt) {
        if (ctx.event === 0) {
          return
        }

        Platform.is.firefox === true && preventDraggable(el, false)

        if (ctx.event.detected === true) {
          const fn = (modifiers.mouse === true && ctx.event.mouse === true) || (modifiers.stop === true && modifiers.prevent === true)
            ? stopAndPrevent
            : (modifiers.stop === true
              ? stop
              : (modifiers.prevent === true ? prevent : void 0)
            )
          fn !== void 0 && setTimeout(() => {
            document.removeEventListener('click', fn, notPassiveCapture)
          }, 50)

          if (ctx.event.mouse === true) {
            document.documentElement.style.cursor = ''
            document.body.classList.remove('non-selectable')
          }
        }

        if (
          ctx.event.abort !== true &&
          ctx.event.detected === true &&
          ctx.event.isFirst !== true
        ) {
          handleEvent(evt, ctx.event.mouse)
          ctx.handler(getChanges(evt, ctx, true))
        }

        setTimeout(() => {
          ctx.event = void 0
          ctx.touchTarget = void 0
        }, 0)
      }
    }

    if (el.__qtouchpan) {
      el.__qtouchpan_old = el.__qtouchpan
    }

    el.__qtouchpan = ctx

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, listenOpts[`passive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, listenOpts[`passive${modifiers.capture === true ? 'Capture' : ''}`])
      el.addEventListener('touchmove', ctx.move, touchEvtOpts)
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
      const
        touchPassiveStr = modifiers.mightPrevent !== true && modifiers.prevent !== true
          ? 'passive'
          : 'notPassive',
        touchEvtOpts = listenOpts[touchPassiveStr + (modifiers.capture === true ? 'Capture' : '')],
        mouseEvtOpts = listenOpts['notPassive' + (modifiers.mouseCapture === true ? 'Capture' : '')]

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, listenOpts[`passive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, listenOpts[`passive${modifiers.capture === true ? 'Capture' : ''}`])
        el.removeEventListener('touchmove', ctx.move, touchEvtOpts)
      }

      if (ctx.event !== void 0) {
        Platform.is.firefox === true && preventDraggable(el, false)

        if (ctx.event.detected === true) {
          const fn = (modifiers.mouse === true && ctx.event.mouse === true) || (modifiers.stop === true && modifiers.prevent === true)
            ? stopAndPrevent
            : (modifiers.stop === true
              ? stop
              : (modifiers.prevent === true ? prevent : void 0)
            )
          fn !== void 0 && document.removeEventListener('click', fn, notPassiveCapture)

          if (ctx.event.mouse === true) {
            document.documentElement.style.cursor = ''
            document.body.classList.remove('non-selectable')
          }
        }

        if (ctx.event.mouse === true) {
          document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
          document.removeEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
        }
        else {
          const touchTarget = ctx.touchTarget
          if (touchTarget !== void 0) {
            touchTarget.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
            touchTarget.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          }
        }
      }

      ctx.event = void 0
      ctx.touchTarget = void 0

      delete el[el.__qtouchpan_old ? '__qtouchpan_old' : '__qtouchpan']
    }
  }
}
