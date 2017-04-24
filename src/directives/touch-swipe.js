import { add, get, remove } from '../utils/store'
import { position } from '../utils/event'

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  let dir = {}

  ;['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true
    }
  })
  if (dir.horizontal) {
    dir.left = dir.right = true
  }
  if (dir.vertical) {
    dir.up = dir.down = true
  }
  if (dir.left || dir.right) {
    dir.horizontal = true
  }
  if (dir.up || dir.down) {
    dir.vertical = true
  }

  return dir
}

function updateClasses (el, dir) {
  el.classList.add('q-touch')

  if (dir.horizontal && !dir.vertical) {
    el.classList.add('q-touch-y')
    el.classList.remove('q-touch-x')
  }
  else if (!dir.horizontal && dir.vertical) {
    el.classList.add('q-touch-x')
    el.classList.remove('q-touch-y')
  }
}

export default {
  name: 'touch-swipe',
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      direction: getDirection(binding.modifiers),

      start (evt) {
        let pos = position(evt)
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical
        }
        document.addEventListener('mousemove', ctx.move)
        document.addEventListener('mouseup', ctx.end)
      },
      move (evt) {
        let
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y

        if (ctx.event.prevent) {
          evt.preventDefault()
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true
        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault()
            ctx.event.prevent = true
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault()
            ctx.event.prevent = true
          }
        }
      },
      end (evt) {
        document.removeEventListener('mousemove', ctx.move)
        document.removeEventListener('mouseup', ctx.end)

        let
          direction,
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y

        if (distX !== 0 || distY !== 0) {
          if (Math.abs(distX) >= Math.abs(distY)) {
            direction = distX < 0 ? 'left' : 'right'
          }
          else {
            direction = distY < 0 ? 'up' : 'down'
          }

          if (ctx.direction[direction]) {
            ctx.handler({
              evt,
              direction,
              duration: new Date().getTime() - ctx.event.time,
              distance: {
                x: Math.abs(distX),
                y: Math.abs(distY)
              }
            })
          }
        }
      }
    }

    add('touchswipe', el, ctx)
    updateClasses(el, ctx.direction)
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('mousedown', ctx.start)
    el.addEventListener('touchmove', ctx.move)
    el.addEventListener('touchend', ctx.end)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      let ctx = get('touchswipe', el)
      ctx.handler = binding.value
    }
  },
  unbind (el, binding) {
    let ctx = get('touchswipe', el)
    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('mousedown', ctx.start)
    el.removeEventListener('touchmove', ctx.move)
    el.removeEventListener('touchend', ctx.end)
    remove('touchswipe', el)
  }
}
