import { client } from '../plugins/Platform.js'
import { getModifierDirections, updateModifiers, addEvt, cleanEvt, getTouchTarget } from '../utils/touch.js'
import { position, leftClick, prevent, stop, stopAndPrevent, preventDraggable } from '../utils/event.js'
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

  let synthetic = false

  if (dir === void 0 && isFinal !== true) {
    if (ctx.event.isFirst === true || ctx.event.lastDir === void 0) {
      return {}
    }

    dir = ctx.event.lastDir
    synthetic = true

    if (dir === 'left' || dir === 'right') {
      pos.left -= distX
      absX = 0
      distX = 0
    }
    else {
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

let uid = 0

export default {
  name: 'touch-pan',

  bind (el, { value, modifiers }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && client.has.touch !== true) {
      return
    }

    function handleEvent (evt, mouseEvent) {
      if (modifiers.mouse === true && mouseEvent === true) {
        stopAndPrevent(evt)
      }
      else {
        modifiers.stop === true && stop(evt)
        modifiers.prevent === true && prevent(evt)
      }
    }

    const ctx = {
      uid: 'qvtp_' + (uid++),
      handler: value,
      modifiers,
      direction: getModifierDirections(modifiers),

      noop () {},

      mouseStart (evt) {
        if (
          ctx.event === void 0 &&
          evt.target !== void 0 &&
          evt.target.draggable !== true &&
          leftClick(evt) === true &&
          (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1)
        ) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'move', 'notPassiveCapture' ],
            [ document, 'mouseup', 'end', 'passiveCapture' ]
          ])

          ctx.start(evt, true)
        }
      },

      touchStart (evt) {
        if (
          ctx.event === void 0 &&
          evt.target !== void 0 &&
          evt.target.draggable !== true &&
          (evt.qClonedBy === void 0 || evt.qClonedBy.indexOf(ctx.uid) === -1)
        ) {
          const target = getTouchTarget(evt.target)
          addEvt(ctx, 'temp', [
            [ target, 'touchmove', 'move', 'notPassiveCapture' ],
            [ target, 'touchcancel', 'end', 'passiveCapture' ],
            [ target, 'touchend', 'end', 'passiveCapture' ]
          ])
          ctx.start(evt)
        }
      },

      start (evt, mouseEvent) {
        client.is.firefox === true && preventDraggable(el, true)

        const pos = position(evt)

        // stop propagation so possible upper v-touch-pan don't catch this as well
        if (
          (mouseEvent === true && modifiers.mouseAllDir === true) ||
          (mouseEvent !== true && modifiers.stop === true)
        ) {
          const clone = evt.type.indexOf('mouse') > -1
            ? new MouseEvent(evt.type, evt)
            : new TouchEvent(evt.type, evt)

          evt.defaultPrevented === true && prevent(clone)
          evt.cancelBubble === true && stop(clone)

          clone.qClonedBy = evt.qClonedBy === void 0
            ? [ctx.uid]
            : evt.qClonedBy.concat(ctx.uid)
          clone.qKeyEvent = evt.qKeyEvent
          clone.qClickOutside = evt.qClickOutside

          ctx.initialEvent = {
            target: evt.target,
            event: clone
          }

          stop(evt)
        }

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: Date.now(),
          mouse: mouseEvent === true,
          detected: false,
          isFirst: true,
          isFinal: false,
          lastX: pos.left,
          lastY: pos.top
        }
      },

      move (evt) {
        if (ctx.event === void 0) {
          return
        }

        if (ctx.event.detected === true) {
          ctx.event.isFirst !== true && handleEvent(evt, ctx.event.mouse)

          const { payload, synthetic } = getChanges(evt, ctx, false)

          if (payload !== void 0) {
            if (ctx.handler(payload) === false) {
              ctx.end(evt)
            }
            else {
              if (ctx.event.isFirst === true) {
                handleEvent(evt, ctx.event.mouse)
                document.documentElement.style.cursor = 'grabbing'
                ctx.event.mouse === true && document.body.classList.add('no-pointer-events')
                document.body.classList.add('non-selectable')
                clearSelection()
              }
              ctx.event.lastX = payload.position.left
              ctx.event.lastY = payload.position.top
              ctx.event.lastDir = synthetic === true ? void 0 : payload.direction
              ctx.event.isFirst = false
            }
          }

          return
        }

        if (ctx.direction.all === true) {
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
        else if (ctx.event.mouse !== true || modifiers.mouseAllDir !== true || (Date.now() - ctx.event.time) > 200) {
          ctx.end(evt, true)
        }
      },

      end (evt, abort) {
        if (ctx.event === void 0) {
          return
        }

        cleanEvt(ctx, 'temp')
        client.is.firefox === true && preventDraggable(el, false)

        document.documentElement.style.cursor = ''
        document.body.classList.remove('non-selectable')

        if (ctx.event.detected === true && ctx.event.mouse === true) {
          setTimeout(() => {
            document.body.classList.remove('no-pointer-events')
          }, 50)
        }

        if (
          abort !== true &&
          ctx.event.detected === true &&
          ctx.event.isFirst !== true
        ) {
          ctx.handler(getChanges(evt, ctx, true).payload)
        }

        if (abort === true && ctx.event.detected !== true && ctx.initialEvent !== void 0) {
          ctx.initialEvent.target.dispatchEvent(ctx.initialEvent.event)
        }

        ctx.event = void 0
        ctx.initialEvent = void 0
      }
    }

    if (el.__qtouchpan) {
      el.__qtouchpan_old = el.__qtouchpan
    }

    el.__qtouchpan = ctx

    modifiers.mouse === true && addEvt(ctx, 'main', [
      [ el, 'mousedown', 'mouseStart', `passive${modifiers.mouseCapture === true ? 'Capture' : ''}` ]
    ])

    client.has.touch === true && addEvt(ctx, 'main', [
      [ el, 'touchstart', 'touchStart', `passive${modifiers.capture === true ? 'Capture' : ''}` ],
      [ el, 'touchmove', 'noop', 'notPassiveCapture' ]
    ])
  },

  update (el, binding) {
    const ctx = el.__qtouchpan
    ctx !== void 0 && updateModifiers(ctx, binding)
  },

  unbind (el) {
    const ctx = el.__qtouchpan_old || el.__qtouchpan

    if (ctx !== void 0) {
      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      client.is.firefox === true && preventDraggable(el, false)

      document.documentElement.style.cursor = ''
      document.body.classList.remove('non-selectable')

      if (ctx.event !== void 0 && ctx.event.detected === true && ctx.event.mouse === true) {
        document.body.classList.remove('no-pointer-events')
      }

      delete el[el.__qtouchpan_old ? '__qtouchpan_old' : '__qtouchpan']
    }
  }
}
