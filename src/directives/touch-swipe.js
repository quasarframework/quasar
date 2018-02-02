import { position, leftClick } from '../utils/event'

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

export default {
  name: 'touch-swipe',
  bind (el, binding) {
    const mouse = !binding.modifiers.noMouse

    let ctx = {
      handler: binding.value,
      threshold: parseInt(binding.arg, 10) || 300,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.move)
          document.addEventListener('mouseup', ctx.mouseEnd)
          ctx.start(evt)
        }
      },
      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.move)
        document.removeEventListener('mouseup', ctx.mouseEnd)
        ctx.end(evt)
      },

      start (evt) {
        const pos = position(evt)

        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          abort: false
        }
      },
      move (evt) {
        if (ctx.event.abort) {
          return
        }

        if (new Date().getTime() - ctx.event.time > ctx.threshold) {
          ctx.event.abort = true
          return
        }

        if (ctx.event.detected) {
          evt.stopPropagation()
          evt.preventDefault()
          return
        }

        const
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          absX = Math.abs(distX),
          distY = pos.top - ctx.event.y,
          absY = Math.abs(distY)

        if (absX === absY) {
          return
        }

        ctx.event.detected = true
        ctx.event.abort = !(
          (ctx.direction.vertical && absX < absY) ||
          (ctx.direction.horizontal && absX > absY) ||
          (ctx.direction.up && absX < absY && distY < 0) ||
          (ctx.direction.down && absX < absY && distY > 0) ||
          (ctx.direction.left && absX > absY && distX < 0) ||
          (ctx.direction.right && absX > absY && distX > 0)
        )

        ctx.move(evt)
      },
      end (evt) {
        if (ctx.event.abort || !ctx.event.detected) {
          return
        }

        const duration = new Date().getTime() - ctx.event.time
        if (duration > ctx.threshold) {
          return
        }

        evt.stopPropagation()
        evt.preventDefault()

        let
          direction,
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          absX = Math.abs(distX),
          distY = pos.top - ctx.event.y,
          absY = Math.abs(distY)

        if (absX >= absY) {
          if (absX < 50) {
            return
          }
          direction = distX < 0 ? 'left' : 'right'
        }
        else {
          if (absY < 50) {
            return
          }
          direction = distY < 0 ? 'up' : 'down'
        }

        if (ctx.direction[direction]) {
          ctx.handler({
            evt,
            direction,
            duration,
            distance: {
              x: absX,
              y: absY
            }
          })
        }
      }
    }

    el.__qtouchswipe = ctx
    el.classList.add('q-touch')

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }

    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.move)
    el.addEventListener('touchend', ctx.end)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchswipe.handler = binding.value
    }
  },
  unbind (el, binding) {
    const ctx = el.__qtouchswipe
    if (!ctx) { return }

    el.removeEventListener('mousedown', ctx.mouseStart)

    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('touchmove', ctx.move)
    el.removeEventListener('touchend', ctx.end)

    delete el.__qtouchswipe
  }
}
