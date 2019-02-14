import { position, leftClick, stopAndPrevent } from '../utils/event.js'
import { clearSelection } from '../utils/selection.js'

function updateBinding (el, binding) {
  const ctx = el.__qtouchhold

  ctx.duration = parseInt(binding.arg, 10) || 600

  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value
  }
}

export default {
  name: 'touch-hold',

  bind (el, binding) {
    const mouse = binding.modifiers.mouse === true

    let ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseMove)
          document.addEventListener('mouseup', ctx.mouseMove)
          ctx.start(evt)
        }
      },

      mouseMove (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove)
        document.removeEventListener('mouseup', ctx.mouseMove)
        ctx.move(evt)
      },

      start (evt) {
        const startTime = new Date().getTime()

        ctx.triggered = false

        ctx.timer = setTimeout(() => {
          clearSelection()

          if (mouse) {
            document.removeEventListener('mousemove', ctx.mouseMove)
            document.removeEventListener('mouseup', ctx.mouseMove)
          }

          ctx.handler({
            evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },

      move (evt) {
        if (ctx.triggered === true) {
          stopAndPrevent(evt)
        }
        else {
          clearTimeout(ctx.timer)
        }
      }
    }

    if (el.__qtouchhold) {
      el.__qtouchhold_old = el.__qtouchhold
    }

    el.__qtouchhold = ctx
    updateBinding(el, binding)

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.move)
    el.addEventListener('touchend', ctx.move)
  },

  update (el, binding) {
    updateBinding(el, binding)
  },

  unbind (el) {
    let ctx = el.__qtouchhold_old || el.__qtouchhold
    if (ctx !== void 0) {
      clearTimeout(ctx.timer)
      el.removeEventListener('touchstart', ctx.start)
      el.removeEventListener('touchend', ctx.move)
      el.removeEventListener('touchmove', ctx.move)
      el.removeEventListener('mousedown', ctx.mouseStart)
      document.removeEventListener('mousemove', ctx.mouseMove)
      document.removeEventListener('mouseup', ctx.mouseMove)
      delete el[el.__qtouchhold_old ? '__qtouchhold_old' : '__qtouchhold']
    }
  }
}
