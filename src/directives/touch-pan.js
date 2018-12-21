import { position, leftClick, listenOpts } from '../utils/event.js'

function getDirection (mod) {
  const
    none = mod.horizontal !== true && mod.vertical !== true,
    dir = {}

  if (mod.horizontal === true || none === true) {
    dir.horizontal = true
  }
  if (mod.vertical === true || none === true) {
    dir.vertical = true
  }

  return dir
}

function processChanges (evt, ctx, isFinal) {
  let
    pos = position(evt),
    direction,
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY)

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right'
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down'
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right'
  }
  else {
    direction = distY < 0 ? 'up' : 'down'
  }

  return {
    evt,
    position: pos,
    direction,
    isFirst: ctx.event.isFirst,
    isFinal,
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
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

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

export default {
  name: 'touch-pan',

  bind (el, binding) {
    const
      mouse = binding.modifiers.noMouse !== true,
      stopPropagation = binding.modifiers.stop,
      preventDefault = binding.modifiers.prevent,
      evtOpts = preventDefault || binding.modifiers.mightPrevent ? null : listenOpts.passive

    let ctx = {
      handler: binding.value,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.move, evtOpts)
          document.addEventListener('mouseup', ctx.mouseEnd, evtOpts)
          ctx.start(evt, true)
        }
      },

      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, evtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, evtOpts)
        ctx.end(evt)
      },

      start (evt, mouseEvent) {
        const pos = position(evt)

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: mouseEvent === true || (ctx.direction.horizontal && ctx.direction.vertical),
          abort: false,
          isFirst: true,
          lastX: pos.left,
          lastY: pos.top
        }

        if (ctx.event.detected) {
          el.classList.add('q-touch')

          if (mouseEvent !== true) {
            stopPropagation && evt.stopPropagation()
            preventDefault && evt.preventDefault()
            ctx.move(evt)
          }
        }
      },

      move (evt) {
        if (ctx.event.abort === true) {
          return
        }

        if (ctx.event.detected === true) {
          stopPropagation && evt.stopPropagation()
          preventDefault && evt.preventDefault()

          const changes = processChanges(evt, ctx, false)
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes)
            ctx.event.lastX = changes.position.left
            ctx.event.lastY = changes.position.top
            ctx.event.isFirst = false
          }

          return
        }

        const
          pos = position(evt),
          distX = Math.abs(pos.left - ctx.event.x),
          distY = Math.abs(pos.top - ctx.event.y)

        if (distX === distY) {
          return
        }

        ctx.event.detected = true
        ctx.event.abort = ctx.direction.vertical
          ? distX > distY
          : distX < distY

        ctx.move(evt)
      },

      end (evt) {
        el.classList.remove('q-touch')
        if (ctx.event.abort || !ctx.event.detected || ctx.event.isFirst) {
          return
        }

        stopPropagation && evt.stopPropagation()
        preventDefault && evt.preventDefault()
        ctx.handler(processChanges(evt, ctx, true))
      }
    }

    if (el.__qtouchpan) {
      el.__qtouchpan_old = el.__qtouchpan
    }

    el.__qtouchpan = ctx

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart, evtOpts)
    }
    el.addEventListener('touchstart', ctx.start, evtOpts)
    el.addEventListener('touchmove', ctx.move, evtOpts)
    el.addEventListener('touchend', ctx.end, evtOpts)
  },

  update (el, { oldValue, value, modifiers }) {
    const ctx = el.__qtouchpan

    if (oldValue !== value) {
      ctx.handler = value
    }

    if (
      (modifiers.horizontal !== ctx.direction.horizontal) ||
      (modifiers.vertical !== ctx.direction.vertical)
    ) {
      ctx.direction = getDirection(modifiers)
    }
  },

  unbind (el, binding) {
    let ctx = el.__qtouchpan_old || el.__qtouchpan
    if (ctx !== void 0) {
      const evtOpts = binding.modifiers.prevent ? null : listenOpts.passive

      el.removeEventListener('mousedown', ctx.mouseStart, evtOpts)

      el.removeEventListener('touchstart', ctx.start, evtOpts)
      el.removeEventListener('touchmove', ctx.move, evtOpts)
      el.removeEventListener('touchend', ctx.end, evtOpts)

      delete el[el.__qtouchpan_old ? '__qtouchpan_old' : '__qtouchpan']
    }
  }
}
