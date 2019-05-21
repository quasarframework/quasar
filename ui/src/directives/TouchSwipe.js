import Platform from '../plugins/Platform.js'
import { setObserver, removeObserver } from '../utils/touch-observer.js'
import { position, leftClick, stopAndPrevent, listenOpts } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

function getDirection (mod) {
  let dir = {}

  ;['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true
    }
  })

  if (Object.keys(dir).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  if (dir.horizontal) {
    dir.left = dir.right = true
  }
  if (dir.vertical) {
    dir.up = dir.down = true
  }
  if (dir.left && dir.right) {
    dir.horizontal = true
  }
  if (dir.up && dir.down) {
    dir.vertical = true
  }

  return dir
}

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

  bind (el, binding) {
    const mouse = binding.modifiers.mouse === true

    let ctx = {
      handler: binding.value,
      sensitivity: parseArg(binding.arg),
      mod: binding.modifiers,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.move, listenOpts.notPassive)
          document.addEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
          document.addEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        setTimeout(() => {
          ctx.mouseEndClick(evt)
        })
      },

      mouseEndClick (evt) {
        document.removeEventListener('mousemove', ctx.move, listenOpts.notPassive)
        document.removeEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        removeObserver(ctx)
        mouseEvent !== true && setObserver(el, evt, ctx)

        const pos = position(evt)

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

        if (Platform.is.mobile) {
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
          ctx.direction.vertical &&
          absX < absY &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = distY < 0 ? 'up' : 'down'
        }

        if (
          ctx.direction.horizontal &&
          absX > absY &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = distX < 0 ? 'left' : 'right'
        }

        if (
          ctx.direction.up &&
          absX < absY &&
          distY < 0 &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'up'
        }

        if (
          ctx.direction.down &&
          absX < absY &&
          distY > 0 &&
          absX < 100 &&
          velY > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'down'
        }

        if (
          ctx.direction.left &&
          absX > absY &&
          distX < 0 &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'left'
        }

        if (
          ctx.direction.right &&
          absX > absY &&
          distX > 0 &&
          absY < 100 &&
          velX > ctx.sensitivity[0]
        ) {
          ctx.event.dir = 'right'
        }

        if (ctx.event.dir !== false) {
          stopAndPrevent(evt)
          clearSelection()

          ctx.handler({
            evt,
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

        removeObserver(ctx)

        if (ctx.event.dir !== false) {
          ctx.event.abort === false && stopAndPrevent(evt)
        }

        ctx.event = void 0
      }
    }

    if (el.__qtouchswipe) {
      el.__qtouchswipe_old = el.__qtouchswipe
    }

    el.__qtouchswipe = ctx

    if (mouse === true) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }

    el.addEventListener('touchstart', ctx.start, listenOpts.notPassive)
    el.addEventListener('touchmove', ctx.move, listenOpts.notPassive)
    el.addEventListener('touchcancel', ctx.end, listenOpts.notPassive)
    el.addEventListener('touchend', ctx.end, listenOpts.notPassive)
  },

  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchswipe.handler = binding.value
    }
  },

  unbind (el, binding) {
    const ctx = el.__qtouchswipe_old || el.__qtouchswipe
    if (ctx !== void 0) {
      removeObserver(ctx)

      if (binding.modifiers.mouse === true) {
        el.removeEventListener('mousedown', ctx.mouseStart)
        document.removeEventListener('mousemove', ctx.move, listenOpts.notPassive)
        document.removeEventListener('mouseup', ctx.mouseEnd, listenOpts.notPassive)
        document.removeEventListener('click', ctx.mouseEndClick, listenOpts.notPassiveCapture)
      }
      el.removeEventListener('touchstart', ctx.start, listenOpts.notPassive)
      el.removeEventListener('touchmove', ctx.move, listenOpts.notPassive)
      el.removeEventListener('touchcancel', ctx.end, listenOpts.notPassive)
      el.removeEventListener('touchend', ctx.end, listenOpts.notPassive)

      delete el[el.__qtouchswipe_old ? '__qtouchswipe_old' : '__qtouchswipe']
    }
  }
}
