import { client } from '../plugins/Platform.js'
import { getModifierDirections, updateModifiers, addEvt, cleanEvt } from '../utils/touch.js'
import { position, leftClick, stopAndPrevent, listenOpts, preventDraggable } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

const { notPassiveCapture } = listenOpts

function parseArg (arg) {
  // delta (min velocity -- dist / time)
  // mobile min distance on first move
  // desktop min distance until deciding if it's a swipe or not
  const data = [0.06, 6, 50]

  if (typeof arg === 'string' && arg.length) {
    arg.split(':').forEach((val, index) => {
      const v = parseFloat(val)
      v && (data[index] = v)
    })
  }

  return data
}

export default {
  name: 'touch-swipe',

  bind (el, { value, arg, modifiers }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && client.has.touch !== true) {
      return
    }

    const mouseCapture = modifiers.mouseCapture === true ? 'Capture' : ''

    let ctx = {
      handler: value,
      sensitivity: parseArg(arg),

      modifiers: modifiers,
      direction: getModifierDirections(modifiers),

      mouseStart (evt) {
        if (ctx.event === void 0 && leftClick(evt)) {
          addEvt(ctx, 'temp', [
            [ document, 'mousemove', 'move', `notPassive${mouseCapture}` ],
            [ document, 'mouseup', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt, true)
        }
      },

      touchStart (evt) {
        if (ctx.event === void 0 && evt.target !== void 0) {
          addEvt(ctx, 'temp', [
            [ evt.target, 'touchcancel', 'end', 'notPassiveCapture' ],
            [ evt.target, 'touchend', 'end', 'notPassiveCapture' ]
          ])
          ctx.start(evt)
        }
      },

      start (evt, mouseEvent) {
        client.is.firefox === true && preventDraggable(el, true)

        const pos = position(evt)

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          mouse: mouseEvent === true,
          dir: false
        }
      },

      move (evt) {
        if (ctx.event === void 0) {
          return
        }

        if (ctx.event.dir !== false) {
          stopAndPrevent(evt)
          return
        }

        const time = new Date().getTime() - ctx.event.time

        if (time === 0) {
          return
        }

        const
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          absX = Math.abs(distX),
          distY = pos.top - ctx.event.y,
          absY = Math.abs(distY)

        if (ctx.event.mouse !== true) {
          if (absX < ctx.sensitivity[1] && absY < ctx.sensitivity[1]) {
            ctx.end(evt)
            return
          }
        }
        else if (absX < ctx.sensitivity[2] && absY < ctx.sensitivity[2]) {
          return
        }

        const
          velX = absX / time,
          velY = absY / time

        if (
          ctx.direction.vertical === true &&
          absX < absY &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = distY < 0 ? 'up' : 'down'
        }

        if (
          ctx.direction.horizontal === true &&
          absX > absY &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = distX < 0 ? 'left' : 'right'
        }

        if (
          ctx.direction.up === true &&
          absX < absY &&
          distY < 0 &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'up'
        }

        if (
          ctx.direction.down === true &&
          absX < absY &&
          distY > 0 &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'down'
        }

        if (
          ctx.direction.left === true &&
          absX > absY &&
          distX < 0 &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'left'
        }

        if (
          ctx.direction.right === true &&
          absX > absY &&
          distX > 0 &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'right'
        }

        if (ctx.event.dir !== false) {
          stopAndPrevent(evt)
          document.addEventListener('click', stopAndPrevent, notPassiveCapture)

          if (ctx.event.mouse === true) {
            document.body.classList.add('non-selectable')
            clearSelection()
          }

          ctx.handler({
            evt,
            touch: ctx.event.mouse !== true,
            mouse: ctx.event.mouse,
            direction: ctx.event.dir,
            duration: time,
            distance: {
              x: absX,
              y: absY
            }
          })
        }
        else {
          ctx.end(evt)
        }
      },

      end (evt) {
        if (ctx.event === void 0) {
          return
        }

        cleanEvt(ctx, 'temp')
        client.is.firefox === true && preventDraggable(el, false)

        if (ctx.event.dir !== false) {
          stopAndPrevent(evt)
          setTimeout(() => {
            document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
          }, 50)
          ctx.event.mouse === true && document.body.classList.remove('non-selectable')
        }

        ctx.event = void 0
      }
    }

    if (el.__qtouchswipe) {
      el.__qtouchswipe_old = el.__qtouchswipe
    }

    el.__qtouchswipe = ctx

    modifiers.mouse === true && addEvt(ctx, 'main', [
      [ el, 'mousedown', 'mouseStart', `passive${mouseCapture}` ]
    ])

    if (client.has.touch === true) {
      const capture = modifiers.capture === true ? 'Capture' : ''
      addEvt(ctx, 'main', [
        [ el, 'touchstart', 'touchStart', `passive${capture}` ],
        [ el, 'touchmove', 'move', `notPassive${capture}` ]
      ])
    }
  },

  update (el, binding) {
    const ctx = el.__qtouchswipe
    ctx !== void 0 && updateModifiers(ctx, binding)
  },

  unbind (el) {
    const ctx = el.__qtouchswipe_old || el.__qtouchswipe

    if (ctx !== void 0) {
      client.is.firefox === true && preventDraggable(el, false)

      cleanEvt(ctx, 'main')
      cleanEvt(ctx, 'temp')

      if (ctx.event !== void 0 && ctx.event.dir !== false) {
        document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
        ctx.event.mouse === true && document.body.classList.remove('non-selectable')
      }

      delete el[el.__qtouchswipe_old ? '__qtouchswipe_old' : '__qtouchswipe']
    }
  }
}
