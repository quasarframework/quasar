import { client } from '../plugins/Platform.js'
import { getModifierDirections, updateModifiers, addEvt, cleanEvt } from '../utils/touch.js'
import { position, leftClick, listenOpts, prevent, stop, stopAndPrevent, preventDraggable } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

const { notPassiveCapture } = listenOpts

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
    mouse: ctx.event.mouse === true,
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
      handler: value,
      modifiers,
      direction: getModifierDirections(modifiers),

      mouseStart (evt) {
        if (leftClick(evt) === true) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'move', 'notPassiveCapture' ],
            [ document, 'mouseup', 'end', 'passiveCapture' ]
          ])

          ctx.start(evt, true)
        }
      },

      touchMove (evt) {
        if (ctx.event === void 0) {
          return
        }

        ctx.move(evt)

        if (ctx.event !== void 0 && ctx.event.detected === true) {
          el.removeEventListener('touchmove', ctx.touchMove, notPassiveCapture)

          const target = evt.target
          addEvt(ctx, 'temp', [
            [ target, 'touchmove', 'move', 'notPassiveCapture' ],
            [ target, 'touchend', 'end', 'passiveCapture' ],
            [ target, 'touchcancel', 'end', 'passiveCapture' ]
          ])
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
          stop(evt)
        }

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
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

          const changes = getChanges(evt, ctx, false)

          if (changes !== void 0) {
            if (ctx.handler(changes) === false) {
              ctx.end(evt)
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
          ctx.end(evt, true)
        }
      },

      end (evt, abort) {
        if (ctx.event === void 0) {
          return
        }

        cleanEvt(ctx, 'temp')
        client.is.firefox === true && preventDraggable(el, false)

        if (ctx.event.mouse !== true && ctx.event.detected === true) {
          el.addEventListener('touchmove', ctx.touchMove, notPassiveCapture)
        }

        document.documentElement.style.cursor = ''
        document.body.classList.remove('no-pointer-events')
        document.body.classList.remove('non-selectable')

        if (
          abort !== true &&
          ctx.event.detected === true &&
          ctx.event.isFirst !== true
        ) {
          ctx.handler(getChanges(evt, ctx, true))
        }

        ctx.event = void 0
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
      [ el, 'touchstart', 'start', `passive${modifiers.capture === true ? 'Capture' : ''}` ],
      [ el, 'touchmove', 'touchMove', 'notPassiveCapture' ]
    ])
  },

  update (el, binding) {
    const ctx = el.__qtouchpan
    ctx !== void 0 && updateModifiers(ctx, binding)
  },

  unbind (el) {
    let ctx = el.__qtouchpan_old || el.__qtouchpan

    if (ctx !== void 0) {
      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      client.is.firefox === true && preventDraggable(el, false)

      document.documentElement.style.cursor = ''
      document.body.classList.remove('no-pointer-events')
      document.body.classList.remove('non-selectable')

      delete el[el.__qtouchpan_old ? '__qtouchpan_old' : '__qtouchpan']
    }
  }
}
