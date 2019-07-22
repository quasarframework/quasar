import Platform from '../plugins/Platform.js'
import { setObserver, removeObserver, getModifierDirections, updateModifiers } from '../utils/touch.js'
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

export default {
  name: 'touch-swipe',

  bind (el, { value, arg, modifiers }) {
    if (el.__qtouchswipe) {
      el.__qtouchswipe_old = el.__qtouchswipe
    }

    // early return, we don't need to do anything
    if (modifiers.mouse !== true && Platform.has.touch !== true) {
      return
    }

    let ctx = {
      handler: value,
      sensitivity: parseArg(arg),

      modifiers: modifiers,
      direction: getModifierDirections(modifiers),

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.move, true)
          document.addEventListener('mouseup', ctx.mouseEnd, true)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, true)
        document.removeEventListener('mouseup', ctx.mouseEnd, true)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        Platform.is.firefox === true && preventDraggable(el, true)
        removeObserver(ctx)
        mouseEvent !== true && setObserver(el, evt, ctx)

        const pos = position(evt)

        ctx.mouse = mouseEvent
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
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

        if (Platform.is.mobile === true) {
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
          document.body.classList.add('no-pointer-events')
          stopAndPrevent(evt)
          clearSelection()

          ctx.handler({
            evt,
            touch: ctx.mouse !== true,
            mouse: ctx.mouse === true,
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
        removeObserver(ctx)

        if (ctx.event.abort === false && ctx.event.dir !== false) {
          document.body.classList.remove('no-pointer-events')
          stopAndPrevent(evt)
        }

        ctx.event = void 0
      }
    }

    el.__qtouchswipe = ctx

    if (modifiers.mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
    }

    if (Platform.has.touch === true) {
      const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

      el.addEventListener('touchstart', ctx.start, opts)
      el.addEventListener('touchmove', ctx.move, opts)
      el.addEventListener('touchcancel', ctx.end, opts)
      el.addEventListener('touchend', ctx.end, opts)
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
      Platform.is.firefox === true && preventDraggable(el, false)
      removeObserver(ctx)
      document.body.classList.remove('no-pointer-events')

      if (modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart, modifiers.mouseCapture)
        document.removeEventListener('mousemove', ctx.move, true)
        document.removeEventListener('mouseup', ctx.mouseEnd, true)
      }

      if (Platform.has.touch === true) {
        const opts = listenOpts['notPassive' + (modifiers.capture === true ? 'Capture' : '')]

        el.removeEventListener('touchstart', ctx.start, opts)
        el.removeEventListener('touchmove', ctx.move, opts)
        el.removeEventListener('touchcancel', ctx.end, opts)
        el.removeEventListener('touchend', ctx.end, opts)
      }

      delete el[el.__qtouchswipe_old ? '__qtouchswipe_old' : '__qtouchswipe']
    }
  }
}
