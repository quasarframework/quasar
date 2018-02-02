import { position, leftClick, listenOpts } from '../utils/event'

function getDirection (mod) {
  if (!mod.horizontal && !mod.vertical) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  let dir = {}

  ;['horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true
    }
  })

  return dir
}

function processChanges (evt, ctx, isFinal) {
  let
    direction,
    pos = position(evt),
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
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
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
      mouse = !binding.modifiers.noMouse,
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
          ctx.start(evt)
        }
      },
      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move, evtOpts)
        document.removeEventListener('mouseup', ctx.mouseEnd, evtOpts)
        ctx.end(evt)
      },

      start (evt) {
        const pos = position(evt)

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: ctx.direction.horizontal && ctx.direction.vertical,
          abort: false,
          isFirst: true,
          lastX: pos.left,
          lastY: pos.top
        }

        if (ctx.event.detected) {
          stopPropagation && evt.stopPropagation()
          preventDefault && evt.preventDefault()
        }
      },
      move (evt) {
        if (ctx.event.abort) {
          return
        }

        if (ctx.event.detected) {
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
        if (ctx.event.abort || !ctx.event.detected || ctx.event.isFirst) {
          return
        }

        stopPropagation && evt.stopPropagation()
        preventDefault && evt.preventDefault()
        ctx.handler(processChanges(evt, ctx, true))
      }
    }

    el.__qtouchpan = ctx
    el.classList.add('q-touch')

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart, evtOpts)
    }
    el.addEventListener('touchstart', ctx.start, evtOpts)
    el.addEventListener('touchmove', ctx.move, evtOpts)
    el.addEventListener('touchend', ctx.end, evtOpts)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchpan.handler = binding.value
    }
  },
  unbind (el, binding) {
    let ctx = el.__qtouchpan
    if (!ctx) { return }
    const evtOpts = binding.modifiers.prevent ? null : listenOpts.passive

    el.removeEventListener('mousedown', ctx.mouseStart, evtOpts)

    el.removeEventListener('touchstart', ctx.start, evtOpts)
    el.removeEventListener('touchmove', ctx.move, evtOpts)
    el.removeEventListener('touchend', ctx.end, evtOpts)

    delete el.__qtouchpan
  }
}
