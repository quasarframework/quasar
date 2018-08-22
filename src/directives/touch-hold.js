import { position, leftClick } from '../utils/event.js'

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
    const
      mouse = !binding.modifiers.noMouse,
      stopPropagation = binding.modifiers.stop,
      preventDefault = binding.modifiers.prevent

    let ctx = {
      mouseStart (evt) {
        if (leftClick(evt)) {
          document.addEventListener('mousemove', ctx.mouseAbort)
          document.addEventListener('mouseup', ctx.mouseAbort)
          ctx.start(evt)
        }
      },
      mouseAbort (evt) {
        document.removeEventListener('mousemove', ctx.mouseAbort)
        document.removeEventListener('mouseup', ctx.mouseAbort)
        ctx.abort(evt)
      },

      start (evt) {
        const startTime = new Date().getTime()

        stopPropagation && evt.stopPropagation()
        preventDefault && evt.preventDefault()

        ctx.timer = setTimeout(() => {
          if (mouse) {
            document.removeEventListener('mousemove', ctx.mouseAbort)
            document.removeEventListener('mouseup', ctx.mouseAbort)
          }

          ctx.handler({
            evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          })
        }, ctx.duration)
      },
      abort (evt) {
        clearTimeout(ctx.timer)
        ctx.timer = null
      }
    }

    el.__qtouchhold = ctx
    updateBinding(el, binding)

    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart)
    }
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('touchmove', ctx.abort)
    el.addEventListener('touchend', ctx.abort)
  },
  update (el, binding) {
    updateBinding(el, binding)
  },
  unbind (el, binding) {
    let ctx = el.__qtouchhold
    if (!ctx) { return }
    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('touchend', ctx.abort)
    el.removeEventListener('touchmove', ctx.abort)
    el.removeEventListener('mousedown', ctx.mouseStart)
    document.removeEventListener('mousemove', ctx.mouseAbort)
    document.removeEventListener('mouseup', ctx.mouseAbort)
    delete el.__qtouchhold
  }
}
