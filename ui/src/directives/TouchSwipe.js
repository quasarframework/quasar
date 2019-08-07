import Platform from '../plugins/Platform.js'
import { getModifierDirections, updateModifiers } from '../utils/touch.js'
import { position, leftClick, stopAndPrevent, listenOpts, preventDraggable } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

function parseArg (arg) {
  // delta (min velocity -- dist / time)
  // mobile min distance on first move
  // desktop min distance until deciding if it's a swipe or not
  const data = [0.06, 6, 50]

  if (typeof arg === 'string' && arg.length) {
    arg.split(':').forEach((val, index) => {
      const v = parseInt(val, 10)
      v && (data[index] = v)
    })
  }

  return data
}

const { notPassiveCapture } = listenOpts

export default {
  name: 'touch-swipe',

  bind (el, { value, arg, modifiers }) {
    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    const mouseEvtOpts = listenOpts[`notPassive${modifiers.mouseCapture === true ? 'Capture' : ''}`]

    const ctx = {
      handler: value,
      sensitivity: parseArg(arg),

      modifiers: modifiers,
      direction: getModifierDirections(modifiers),

      mouseStart (evt) {
        if (ctx.event === void 0 && leftClick(evt)) {
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
          dir: false,
          abort: false
        }
      },

      move (evt) {
        if (ctx.event === void 0 || ctx.event.abort === true) {
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
            ctx.event.abort = true
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
            mouse: ctx.event.mouse === true,
            direction: ctx.event.dir,
            duration: time,
            distance: {
              x: absX,
              y: absY
            }
          })
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

        if (ctx.event.dir !== false) {
          stopAndPrevent(evt)

          setTimeout(() => {
            document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
          }, 50)
          ctx.event.mouse === true && document.body.classList.remove('non-selectable')
        }

        setTimeout(() => {
          ctx.event = void 0
          ctx.touchTarget = void 0
        }, 0)
      }
    }

    if (el.__qtouchswipe) {
      el.__qtouchswipe_old = el.__qtouchswipe
    }

    el.__qtouchswipe = ctx

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, listenOpts[`passive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
    }

    if (Platform.has.touch === true) {
      el.addEventListener('touchstart', ctx.touchStart, listenOpts[`passive${modifiers.capture === true ? 'Capture' : ''}`])
      el.addEventListener('touchmove', ctx.move, listenOpts[`notPassive${modifiers.capture === true ? 'Capture' : ''}`])
    }
  },

  update (el, binding) {
    const ctx = el.__qtouchswipe

    if (ctx !== void 0) {
      updateModifiers(ctx, binding)
    }
  },

  unbind (el, { modifiers }) {
    const ctx = el.__qtouchswipe_old || el.__qtouchswipe

    if (ctx !== void 0) {
      const mouseEvtOpts = listenOpts[`passive${modifiers.mouseCapture === true ? 'Capture' : ''}`]

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, listenOpts[`passive${modifiers.mouseCapture === true ? 'Capture' : ''}`])
      }

      if (Platform.has.touch === true) {
        el.removeEventListener('touchstart', ctx.touchStart, listenOpts[`passive${modifiers.capture === true ? 'Capture' : ''}`])
        el.removeEventListener('touchmove', ctx.move, listenOpts[`notPassive${modifiers.capture === true ? 'Capture' : ''}`])
      }

      if (ctx.event !== void 0) {
        Platform.is.firefox === true && preventDraggable(el, false)

        if (ctx.event.dir !== false) {
          document.removeEventListener('click', stopAndPrevent, notPassiveCapture)
          ctx.event.mouse === true && document.body.classList.remove('non-selectable')
        }

        if (ctx.event.mouse === true) {
          document.removeEventListener('mousemove', ctx.move, mouseEvtOpts)
          document.removeEventListener('mouseup', ctx.mouseEnd, notPassiveCapture)
        }
        else {
          const target = ctx.touchTarget
          if (target !== void 0) {
            target.removeEventListener('touchcancel', ctx.touchEnd, notPassiveCapture)
            target.removeEventListener('touchend', ctx.touchEnd, notPassiveCapture)
          }
        }
      }

      ctx.event = void 0
      ctx.touchTarget = void 0

      delete el[el.__qtouchswipe_old ? '__qtouchswipe_old' : '__qtouchswipe']
    }
  }
}
